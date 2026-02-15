const db = require('../config/db.js');

/* ===================== PROCESS OUTFLOW (TRASLADO/SALIDA) ===================== */
const processOutflow = async (req, res) => {
    const { motivo, items, tipo = 'SALIDA', id_cliente = null, cliente_nombre = null } = req.body;
    const userId = req.user?.id_usuario || req.user?.id;
    const userName = req.user?.nombre_usuario || req.user?.nombre || 'Admin';

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ msg: 'El carrito está vacío.' });
    }

    if (!motivo && tipo !== 'COTIZACION') {
        return res.status(400).json({ msg: 'Debe especificar un motivo para la salida.' });
    }

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        let totalCosto = 0;
        let totalVenta = 0;
        let totalItems = 0;
        const processedItems = [];

        for (const item of items) {
            const pid = item.id_producto || item.id;
            const qty = parseInt(item.cantidad || item.quantity, 10);
            const overriddenUnit = item.precio_modificado || item.unit || null;

            if (qty <= 0) continue;

            const [rows] = await connection.query(
                'SELECT existencia, nombre, costo, venta, codigo FROM productos WHERE id_producto = ? FOR UPDATE',
                [pid]
            );

            if (rows.length === 0) {
                throw new Error(`Producto ID ${pid} no encontrado.`);
            }

            const product = rows[0];

            // Only check stock and deduct if it's a REAL OUTFLOW
            if (tipo === 'SALIDA') {
                if (product.existencia < qty) {
                    throw new Error(`Stock insuficiente para "${product.nombre}". Disponible: ${product.existencia}, Solicitado: ${qty}.`);
                }
                const newStock = product.existencia - qty;
                await connection.query('UPDATE productos SET existencia = ? WHERE id_producto = ?', [newStock, pid]);

                // Log individual movement only for real outflows
                await connection.query(
                    'INSERT INTO movimientos_inventario (id_producto, tipo_movimiento, detalles, id_usuario) VALUES (?, ?, ?, ?)',
                    [pid, 'SALIDA_LOTE', `Salida (Traslado): ${qty} un. Motivo: ${motivo}`, userId]
                );
            }

            const unitPrice = overriddenUnit !== null ? Number(overriddenUnit) : Number(product.venta);
            const costoLine = Number(product.costo) * qty;
            const ventaLine = unitPrice * qty;

            totalCosto += costoLine;
            totalVenta += ventaLine;
            totalItems += qty;

            processedItems.push({
                id: pid,
                codigo: product.codigo,
                nombre: product.nombre,
                quantity: qty,
                unit: unitPrice,
                cost: Number(product.costo),
                total: ventaLine
            });
        }

        const detallesJson = JSON.stringify({ items: processedItems });

        const [result] = await connection.query(`
            INSERT INTO inventory_outflows 
            (usuario_id, usuario_nombre, motivo, total_items, total_costo, total_venta, detalles_json, tipo, id_cliente, cliente_nombre)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [userId, userName, motivo || 'Cotización', totalItems, totalCosto, totalVenta, detallesJson, tipo, id_cliente, cliente_nombre]);

        const outflowId = result.insertId;

        await connection.commit();

        if (tipo === 'SALIDA') {
            const io = req.app.get('io');
            if (io) io.emit('inventory_update', { action: 'bulk_outflow' });
        }

        const ticketData = {
            id: tipo === 'COTIZACION' ? `COT-${outflowId}` : `TR-${outflowId}`,
            outflowId: outflowId,
            type: tipo === 'COTIZACION' ? 'quote' : 'outflow',
            tipo: tipo,
            fecha: new Date().toISOString(),
            usuarioNombre: userName,
            clienteNombre: tipo === 'COTIZACION' ? (cliente_nombre || 'Cliente General') : `MOTIVO: ${motivo}`,
            items: processedItems,
            totalVenta: totalVenta,
            totalCosto: totalCosto,
            totalItems: totalItems,
            isOutflow: true,
            isQuote: tipo === 'COTIZACION'
        };

        res.status(201).json({ msg: tipo === 'COTIZACION' ? 'Cotización generada.' : 'Salida procesada.', ticket: ticketData });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error processing outflow/quote:', error);
        res.status(500).json({ msg: error.message || 'Error al procesar la solicitud.' });
    } finally {
        if (connection) connection.release();
    }
};

/* ===================== GET HISTORY ===================== */
const getOutflowHistory = async (req, res) => {
    try {
        const [rows] = await db.query(`
      SELECT * FROM inventory_outflows 
      ORDER BY fecha DESC 
      LIMIT 100
    `);

        // Parse JSON details for frontend
        const history = rows.map(row => {
            let items = [];
            try {
                const parsed = typeof row.detalles_json === 'string' ? JSON.parse(row.detalles_json) : row.detalles_json;
                items = parsed.items || [];
            } catch (e) { items = []; }

            return {
                ...row,
                items // Expand items for viewing
            };
        });

        res.json(history);
    } catch (error) {
        console.error('Error fetching outflow history:', error);
        res.status(500).json({ msg: 'Error al obtener el historial.' });
    }
};

module.exports = {
    processOutflow,
    getOutflowHistory
};
