const pool = require('../config/db'); // Conexión a MySQL

/* ───────────────────────── Helpers ───────────────────────── */
function safeParseJSON(v) {
  try { return typeof v === 'string' ? JSON.parse(v) : (v || {}); }
  catch { return {}; }
}

/* ───────────────────────── createSale ───────────────────────── */
const createSale = async (req, res) => {
  const connection = await pool.getConnection();
  const { totalVenta, items, pagoDetalles, userId, clientId } = req.body;

  try {
    await connection.beginTransaction();

    if (!totalVenta && totalVenta !== 0 || !items || items.length === 0 || !pagoDetalles || !userId) {
      return res.status(400).json({ message: 'Faltan datos o no hay productos en la venta.' });
    }

    const montoCredito = pagoDetalles.credito || 0;
    const saleData = {
      fecha: new Date(),
      total_venta: totalVenta,
      subtotal: req.body.subtotal || totalVenta,
      descuento: req.body.descuento || 0,
      estado: 'COMPLETADA',
      id_usuario: userId,
      id_cliente: clientId,
      pago_detalles: JSON.stringify({ ...pagoDetalles, tasaDolarAlMomento: req.body.tasaDolarAlMomento }),
      tipo_venta: montoCredito > 0 ? 'CREDITO' : 'CONTADO',
      referencia_pedido: req.body.referencia_pedido
    };

    const [saleResult] = await connection.query('INSERT INTO ventas SET ?', saleData);
    const saleId = saleResult.insertId;

    // Actualizar saldo del cliente
    if (montoCredito > 0 && clientId) {
      await connection.query(
        'UPDATE clientes SET saldo_pendiente = saldo_pendiente + ? WHERE id_cliente = ?',
        [montoCredito, clientId]
      );

      // ★ NUEVO: Registrar en creditos_cliente para tracking por ticket
      await connection.query(
        `INSERT INTO creditos_cliente (id_venta, id_cliente, monto_original, saldo_restante, fecha)
         VALUES (?, ?, ?, ?, NOW())`,
        [saleId, clientId, montoCredito, montoCredito]
      );
    }

    for (const item of items) {
      await connection.query(
        'INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
        [saleId, item.id || item.id_producto, item.quantity, item.precio]
      );
      await connection.query('UPDATE productos SET existencia = existencia - ? WHERE id_producto = ?', [item.quantity, item.id || item.id_producto]);
    }

    await connection.commit();

    // ─── SOCKET.IO EMIT ───
    const io = req.app.get('io');
    if (io) io.emit('inventory_update');

    const [newSale] = await connection.query('SELECT * FROM ventas WHERE id_venta = ?', [saleId]);

    res.status(201).json({
      message: 'Venta creada exitosamente',
      saleId,
      saleData: { ...newSale[0], items, pagoDetalles }
    });

  } catch (error) {
    await connection.rollback();
    console.error('ERROR en createSale:', error);
    res.status(500).json({ message: error.message || 'Error en el servidor' });
  } finally {
    if (connection) connection.release();
  }
};

/* ───────────────────────── cancelSale ───────────────────────── */
const cancelSale = async (req, res) => {
  const { id } = req.params;
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [sale] = await connection.query('SELECT id_cliente, estado, pago_detalles FROM ventas WHERE id_venta = ? FOR UPDATE', [id]);

    if (sale.length === 0) throw new Error('Venta no encontrada.');
    if (sale[0].estado === 'CANCELADA') throw new Error('Venta ya cancelada.');

    const saleData = sale[0];
    const clientId = saleData.id_cliente;
    let detalles = safeParseJSON(saleData.pago_detalles);
    const montoCredito = detalles.credito || 0;

    const [items] = await connection.query('SELECT id_producto, cantidad FROM detalle_ventas WHERE id_venta = ?', [id]);
    for (const item of items) {
      await connection.query('UPDATE productos SET existencia = existencia + ? WHERE id_producto = ?', [item.cantidad, item.id_producto]);
    }

    if (montoCredito > 0 && clientId) {
      await connection.query('UPDATE clientes SET saldo_pendiente = GREATEST(0, saldo_pendiente - ?) WHERE id_cliente = ?', [montoCredito, clientId]);

      // ★ NUEVO: Marcar ticket de crédito como DEVUELTO
      await connection.query(
        `UPDATE creditos_cliente SET saldo_restante = 0, estado = 'DEVUELTO' WHERE id_venta = ? AND id_cliente = ?`,
        [id, clientId]
      );
    }

    await connection.query('UPDATE ventas SET estado = ? WHERE id_venta = ?', ['CANCELADA', id]);
    await connection.commit();

    // ─── SOCKET.IO EMIT ───
    const io = req.app.get('io');
    if (io) io.emit('inventory_update');

    res.status(200).json({ message: 'Venta cancelada exitosamente.' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: error.message });
  } finally {
    if (connection) connection.release();
  }
};

/* ───────────────────────── createReturn ───────────────────────── */
const createReturn = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { originalSaleId, item, quantity, userId } = req.body;
    const qtyToReturn = Number(quantity);

    if (!originalSaleId || !item || !qtyToReturn || !userId) {
      throw new Error('Faltan datos para la devolución.');
    }

    // 1. Obtener venta original
    const [originalSaleRows] = await connection.query('SELECT * FROM ventas WHERE id_venta = ? FOR UPDATE', [originalSaleId]);
    if (originalSaleRows.length === 0) throw new Error('Venta original no encontrada');
    const originalSale = originalSaleRows[0];

    if (originalSale.estado === 'CANCELADA') throw new Error('No se puede devolver sobre una venta cancelada.');

    // 2. Devolver Stock al inventario
    const productId = item.id || item.id_producto;
    await connection.query('UPDATE productos SET existencia = existencia + ? WHERE id_producto = ?', [qtyToReturn, productId]);

    // 3. Buscar el item en detalle_ventas
    const [detalleRows] = await connection.query('SELECT * FROM detalle_ventas WHERE id_venta = ? AND id_producto = ?', [originalSaleId, productId]);

    if (detalleRows.length === 0) throw new Error('El producto no existe en esta venta.');
    const currentItem = detalleRows[0];

    if (currentItem.cantidad < qtyToReturn) throw new Error('No puedes devolver más cantidad de la que se vendió.');

    // 4. Actualizar o Borrar la línea del producto en el ticket
    if (currentItem.cantidad === qtyToReturn) {
      await connection.query('DELETE FROM detalle_ventas WHERE id_venta = ? AND id_producto = ?', [originalSaleId, productId]);
    } else {
      await connection.query('UPDATE detalle_ventas SET cantidad = cantidad - ? WHERE id_venta = ? AND id_producto = ?', [qtyToReturn, originalSaleId, productId]);
    }

    // 5. Recalcular el Ticket Original
    const [remainingItems] = await connection.query('SELECT * FROM detalle_ventas WHERE id_venta = ?', [originalSaleId]);

    let newSubtotal = 0;
    remainingItems.forEach(i => {
      newSubtotal += (Number(i.cantidad) * Number(i.precio_unitario));
    });

    let newDiscount = 0;
    if (originalSale.subtotal > 0 && originalSale.descuento > 0) {
      const discountRate = originalSale.descuento / originalSale.subtotal;
      newDiscount = newSubtotal * discountRate;
    }
    const newTotal = newSubtotal - newDiscount;

    const refundAmount = (Number(originalSale.total_venta) - newTotal);

    // 6. Actualizar Cabecera de Venta
    let pagoDetalles = safeParseJSON(originalSale.pago_detalles);
    const creditoOriginal = Number(pagoDetalles.credito || 0);

    if (creditoOriginal > 0) {
      // ★ DEVOLUCIÓN DE CRÉDITO: reducir la deuda del cliente
      const creditoRevertir = Math.min(creditoOriginal, refundAmount);
      pagoDetalles.credito -= creditoRevertir;

      if (originalSale.id_cliente) {
        // Reducir saldo_pendiente del cliente
        await connection.query(
          'UPDATE clientes SET saldo_pendiente = GREATEST(0, saldo_pendiente - ?) WHERE id_cliente = ?',
          [creditoRevertir, originalSale.id_cliente]
        );

        // ★ NUEVO: Actualizar creditos_cliente
        const [ticketCredito] = await connection.query(
          'SELECT id, saldo_restante FROM creditos_cliente WHERE id_venta = ? AND id_cliente = ? FOR UPDATE',
          [originalSaleId, originalSale.id_cliente]
        );

        if (ticketCredito.length > 0) {
          const nuevoSaldo = Math.max(0, Number(ticketCredito[0].saldo_restante) - creditoRevertir);
          const nuevoEstado = nuevoSaldo <= 0 ? 'DEVUELTO' : 'PENDIENTE';
          await connection.query(
            'UPDATE creditos_cliente SET saldo_restante = ?, monto_original = monto_original - ?, estado = ? WHERE id = ?',
            [nuevoSaldo, creditoRevertir, nuevoEstado, ticketCredito[0].id]
          );
        }
      }
    } else {
      // Devolución de contado — reducir ingreso en caja
      pagoDetalles.ingresoCaja = (pagoDetalles.ingresoCaja || originalSale.total_venta) - refundAmount;
      pagoDetalles.efectivo = (pagoDetalles.efectivo || originalSale.total_venta) - refundAmount;
    }

    const nuevoEstado = remainingItems.length === 0 ? 'CANCELADA' : 'COMPLETADA';

    await connection.query(
      'UPDATE ventas SET total_venta = ?, subtotal = ?, descuento = ?, pago_detalles = ?, estado = ? WHERE id_venta = ?',
      [newTotal, newSubtotal, newDiscount, JSON.stringify(pagoDetalles), nuevoEstado, originalSaleId]
    );

    // 7. Registro de auditoría
    const esCreditoDevolucion = creditoOriginal > 0;
    const logPagoDetalles = {
      efectivo: esCreditoDevolucion ? 0 : refundAmount,
      ingresoCaja: esCreditoDevolucion ? 0 : -refundAmount,
      credito: esCreditoDevolucion ? -refundAmount : 0,
      nota: `Devolución s/Ticket #${originalSaleId}${esCreditoDevolucion ? ' (crédito)' : ''}`
    };
    await connection.query(
      "INSERT INTO ventas (fecha, total_venta, estado, id_usuario, id_cliente, pago_detalles, tipo_venta) VALUES (NOW(), ?, 'DEVOLUCION', ?, ?, ?, ?)",
      [-refundAmount, userId, originalSale.id_cliente || null, JSON.stringify(logPagoDetalles), originalSale.tipo_venta]
    );

    await connection.commit();

    // ─── SOCKET.IO EMIT ───
    const io = req.app.get('io');
    if (io) io.emit('inventory_update');

    res.status(201).json({
      message: 'Devolución procesada. Ticket original actualizado.',
      originalSaleId,
      refundAmount,
      wasCredit: esCreditoDevolucion
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error en devolución:', error);
    res.status(500).json({ message: error.message || 'Error al procesar la devolución' });
  } finally {
    if (connection) connection.release();
  }
};

/* ───────────────────────── syncCart ───────────────────────── */
const syncCart = async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) return res.status(400).json({ message: 'items debe ser un array' });

    for (const item of items) {
      const [rows] = await pool.query('SELECT existencia FROM productos WHERE id_producto = ?', [item.id || item.id_producto]);
      if (rows.length > 0 && rows[0].existencia < item.quantity) {
        return res.status(409).json({
          message: `Stock insuficiente para ${item.nombre || 'producto'}`,
          producto: item.nombre,
          stockActual: rows[0].existencia,
          cantidadSolicitada: item.quantity
        });
      }
    }
    res.json({ valid: true });
  } catch (error) {
    console.error('Error en syncCart:', error);
    res.status(500).json({ message: 'Error al sincronizar carrito' });
  }
};

/* ───────────────────────── getSales ───────────────────────── */
const getSales = async (req, res) => {
  try {
    const { date } = req.query;
    let query = `
      SELECT v.id_venta, v.fecha, v.total_venta, v.subtotal, v.descuento,
             v.estado, v.id_usuario, v.id_cliente, v.pago_detalles, v.tipo_venta
      FROM ventas v
    `;
    const params = [];

    if (date) {
      query += ` WHERE DATE(DATE_SUB(v.fecha, INTERVAL 6 HOUR)) = ?`;
      params.push(date);
    }
    query += ` ORDER BY v.fecha DESC LIMIT 500`;

    const [sales] = await pool.query(query, params);

    const saleIds = sales.filter(s => s.id_venta).map(s => s.id_venta);
    let details = [];
    if (saleIds.length > 0) {
      const [detailRows] = await pool.query(`
        SELECT dv.id_venta, dv.id_producto, dv.cantidad, dv.precio_unitario, p.nombre, p.codigo
        FROM detalle_ventas dv
        JOIN productos p ON dv.id_producto = p.id_producto
        WHERE dv.id_venta IN (?)
      `, [saleIds]);
      details = detailRows;
    }

    const result = sales.map(sale => {
      let pd = sale.pago_detalles;
      if (typeof pd === 'string') { try { pd = JSON.parse(pd); } catch { pd = {}; } }
      return {
        id: sale.id_venta,
        fecha: sale.fecha,
        totalVenta: sale.total_venta,
        subtotal: sale.subtotal,
        descuento: sale.descuento,
        estado: sale.estado,
        userId: sale.id_usuario,
        clientId: sale.id_cliente,
        pagoDetalles: pd || {},
        tipo_venta: sale.tipo_venta,
        items: details
          .filter(d => d.id_venta === sale.id_venta)
          .map(d => ({
            id: d.id_producto,
            id_producto: d.id_producto,
            nombre: d.nombre,
            codigo: d.codigo,
            quantity: d.cantidad,
            precio: d.precio_unitario
          }))
      };
    });

    res.json(result);
  } catch (error) {
    console.error('Error en getSales:', error);
    res.status(500).json({ message: 'Error al obtener ventas' });
  }
};

module.exports = { createSale, getSales, createReturn, cancelSale, syncCart };