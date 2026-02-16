const pool = require('../config/db');

// ✅ Obtener pedidos (CON NUEVO CAMPO)
const getOrders = async (req, res) => {
    try {
        const query = `
            SELECT 
                o.id_pedido AS id, 
                COALESCE(NULLIF(o.nombre_cliente, ''), 'Cliente no asignado') AS clienteNombre,
                o.id_cliente AS clienteId,
                o.total_pedido AS total, 
                o.abonado, 
                o.estado, 
                o.fecha_creacion AS fecha
            FROM pedidos o
            ORDER BY o.fecha_creacion DESC
        `;
        const [orders] = await pool.query(query);
        res.json(orders);
    } catch (error) {
        console.error('Error al obtener pedidos:', error);
        res.status(500).json({ message: 'Error en el servidor al obtener pedidos' });
    }
};

// ✅ CREAR PEDIDO - VERSIÓN CON NUEVO CAMPO
const createOrder = async (req, res) => {
    const { clienteNombre, items, total, abonoInicial, pagoDetalles } = req.body;
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const estadoInicial = abonoInicial > 0 ? 'APARTADO' : 'PENDIENTE';

        console.log('=== CREANDO PEDIDO ===');
        console.log('Cliente Nombre:', clienteNombre);
        console.log('Estado inicial:', estadoInicial);

        // ✅ GUARDAMOS EL NOMBRE DEL CLIENTE DIRECTAMENTE
        const [orderResult] = await connection.query(
            'INSERT INTO pedidos (id_cliente, nombre_cliente, total_pedido, abonado, estado, fecha_creacion) VALUES (?, ?, ?, ?, ?, NOW())',
            [null, clienteNombre, total, abonoInicial, estadoInicial]
        );

        const orderId = orderResult.insertId;
        console.log('Pedido creado con ID:', orderId);

        // Insertar items del pedido
        for (const item of items) {
            await connection.query(
                'INSERT INTO detalle_pedidos (id_pedido, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
                [orderId, item.id, item.quantity, item.precio]
            );

            await connection.query(
                'UPDATE productos SET existencia = existencia - ?, stock_reservado = stock_reservado + ? WHERE id_producto = ?',
                [item.quantity, item.quantity, item.id]
            );
        }

        // Si hay abono inicial, registrar venta
        if (abonoInicial > 0) {
            await connection.query(
                "INSERT INTO ventas (fecha, total_venta, estado, id_usuario, pago_detalles, tipo_venta, referencia_pedido) VALUES (NOW(), ?, 'ABONO', ?, ?, 'PEDIDO', ?)",
                [abonoInicial, req.user.id, JSON.stringify(pagoDetalles), orderId]
            );
        }

        await connection.commit();

        // Socket emit
        const io = req.app.get('io');
        if (io) io.emit('inventory_update');

        res.status(201).json({
            message: 'Pedido creado exitosamente',
            orderId
        });

    } catch (error) {
        await connection.rollback();
        console.error('❌ Error al crear pedido:', error);
        res.status(500).json({
            message: error.message || 'Error al crear el pedido'
        });
    } finally {
        if (connection) connection.release();
    }
};

// ✅ Obtener detalles del pedido (ACTUALIZADO)
const getOrderDetails = async (req, res) => {
    const { id } = req.params;
    const { search } = req.query;

    try {
        // Datos generales del pedido
        const [orderQuery] = await pool.query(`
            SELECT 
                o.id_pedido AS id, 
                COALESCE(NULLIF(o.nombre_cliente, ''), 'Cliente no asignado') AS cliente,
                o.total_pedido AS total, 
                o.abonado, 
                o.estado, 
                o.fecha_creacion AS fecha
            FROM pedidos o
            WHERE o.id_pedido = ?
        `, [id]);

        if (orderQuery.length === 0) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        // Consulta base para los productos del pedido
        let productQuery = `
            SELECT 
                p.nombre, 
                p.codigo, 
                dp.cantidad, 
                dp.precio_unitario AS precio
            FROM detalle_pedidos dp
            JOIN productos p ON dp.id_producto = p.id_producto
            WHERE dp.id_pedido = ?
        `;
        const params = [id];

        if (search && search.trim() !== '') {
            productQuery += ` AND (p.nombre LIKE ? OR p.codigo LIKE ?)`;
            const likeSearch = `%${search}%`;
            params.push(likeSearch, likeSearch);
        }

        const [itemsQuery] = await pool.query(productQuery, params);

        // Abonos del pedido
        const [abonosQuery] = await pool.query(`
            SELECT fecha, total_venta AS monto, pago_detalles 
            FROM ventas 
            WHERE tipo_venta = 'PEDIDO' AND referencia_pedido = ?
            ORDER BY fecha ASC
        `, [id]);

        res.json({
            ...orderQuery[0],
            items: itemsQuery,
            abonos: abonosQuery
        });
    } catch (error) {
        console.error(`Error al obtener detalles del pedido ${id}:`, error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Las funciones addAbono, liquidarOrder y cancelOrder se mantienen igual...
const addAbono = async (req, res) => {
    const { id } = req.params;
    const { monto, pagoDetalles } = req.body;
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();
        const [orderRows] = await connection.query('SELECT * FROM pedidos WHERE id_pedido = ? FOR UPDATE', [id]);

        if (orderRows.length === 0) {
            throw new Error('Pedido no encontrado');
        }

        const order = orderRows[0];
        const saldoPendiente = parseFloat(order.total_pedido) - parseFloat(order.abonado);

        if (parseFloat(monto) > saldoPendiente + 0.01) {
            throw new Error('El monto del abono no puede ser mayor al saldo pendiente.');
        }

        const nuevoAbonado = parseFloat(order.abonado) + parseFloat(monto);
        await connection.query('UPDATE pedidos SET abonado = ? WHERE id_pedido = ?', [nuevoAbonado, id]);

        await connection.query(
            "INSERT INTO ventas (fecha, total_venta, estado, id_usuario, pago_detalles, tipo_venta, referencia_pedido) VALUES (NOW(), ?, 'ABONO', ?, ?, 'PEDIDO', ?)",
            [monto, req.user.id, JSON.stringify(pagoDetalles), id]
        );

        await connection.commit();
        res.status(200).json({ message: 'Abono registrado exitosamente' });

    } catch (error) {
        await connection.rollback();
        console.error('Error al registrar abono:', error);
        res.status(500).json({ message: error.message || 'Error al registrar abono' });
    } finally {
        if (connection) connection.release();
    }
};

const liquidarOrder = async (req, res) => {
    const { id } = req.params;
    const { pagoDetalles } = req.body;
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();
        const [orderRows] = await connection.query('SELECT * FROM pedidos WHERE id_pedido = ? FOR UPDATE', [id]);

        if (orderRows.length === 0) {
            throw new Error('Pedido no encontrado');
        }

        const order = orderRows[0];
        const saldoPendiente = parseFloat(order.total_pedido) - parseFloat(order.abonado);

        await connection.query(
            'UPDATE pedidos SET abonado = total_pedido, estado = "COMPLETADO" WHERE id_pedido = ?',
            [id]
        );

        await connection.query(
            "INSERT INTO ventas (fecha, total_venta, estado, id_usuario, pago_detalles, tipo_venta, referencia_pedido) VALUES (NOW(), ?, 'LIQUIDACIÓN', ?, ?, 'PEDIDO', ?)",
            [saldoPendiente, req.user.id, JSON.stringify(pagoDetalles), id]
        );

        const [items] = await connection.query('SELECT * FROM detalle_pedidos WHERE id_pedido = ?', [id]);
        for (const item of items) {
            await connection.query(
                'UPDATE productos SET stock_reservado = stock_reservado - ? WHERE id_producto = ?',
                [item.cantidad, item.id_producto]
            );
        }

        await connection.commit();

        const io = req.app.get('io');
        if (io) io.emit('inventory_update');

        res.status(200).json({ message: 'Pedido liquidado y completado exitosamente.' });

    } catch (error) {
        await connection.rollback();
        console.error('Error al liquidar pedido:', error);
        res.status(500).json({ message: error.message || 'Error al liquidar el pedido' });
    } finally {
        if (connection) connection.release();
    }
};

const cancelOrder = async (req, res) => {
    const { id } = req.params;
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();
        const [orderRows] = await connection.query(
            'SELECT * FROM pedidos WHERE id_pedido = ? AND estado != "CANCELADO"',
            [id]
        );

        if (orderRows.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                message: 'Pedido no encontrado o ya está cancelado'
            });
        }

        const [items] = await connection.query('SELECT * FROM detalle_pedidos WHERE id_pedido = ?', [id]);
        for (const item of items) {
            await connection.query(
                'UPDATE productos SET stock_reservado = stock_reservado - ?, existencia = existencia + ? WHERE id_producto = ?',
                [item.cantidad, item.cantidad, item.id_producto]
            );
        }

        await connection.query(
            'UPDATE pedidos SET estado = "CANCELADO" WHERE id_pedido = ?',
            [id]
        );

        await connection.commit();

        const io = req.app.get('io');
        if (io) io.emit('inventory_update');

        res.status(200).json({
            message: 'Pedido cancelado y stock revertido.'
        });

    } catch (error) {
        await connection.rollback();
        console.error('Error al cancelar pedido:', error);
        res.status(500).json({
            message: error.message || 'Error al cancelar el pedido'
        });
    } finally {
        if (connection) connection.release();
    }
};

module.exports = {
    getOrders,
    getOrderDetails,
    createOrder,
    addAbono,
    liquidarOrder,
    cancelOrder,
};