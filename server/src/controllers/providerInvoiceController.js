const db = require('../config/db');

// Obtener todas las facturas
exports.getInvoices = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM facturas_proveedores ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener facturas' });
  }
};

// Crear nueva factura
exports.createInvoice = async (req, res) => {
  const { proveedor, numero_factura, fecha_emision, fecha_vencimiento, monto_total, notas } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO facturas_proveedores 
      (proveedor, numero_factura, fecha_emision, fecha_vencimiento, monto_total, notas, estado) 
      VALUES (?, ?, ?, ?, ?, ?, 'PENDIENTE')`,
      [proveedor, numero_factura, fecha_emision, fecha_vencimiento, monto_total, notas]
    );
    res.status(201).json({ id: result.insertId, message: 'Factura creada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear factura' });
  }
};

// Registrar abono
exports.registerPayment = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body; 

  try {
    // 1. Buscar la factura
    const [invoices] = await db.query('SELECT * FROM facturas_proveedores WHERE id = ?', [id]);
    if (invoices.length === 0) return res.status(404).json({ message: 'Factura no encontrada' });
    
    const invoice = invoices[0];
    const nuevoAbonado = Number(invoice.monto_abonado) + Number(amount);
    
    // 2. Calcular si ya se pagó completa
    let nuevoEstado = invoice.estado;
    if (nuevoAbonado >= invoice.monto_total) {
      nuevoEstado = 'PAGADA';
    }

    // 3. Actualizar BD
    await db.query(
      'UPDATE facturas_proveedores SET monto_abonado = ?, estado = ? WHERE id = ?',
      [nuevoAbonado, nuevoEstado, id]
    );

    res.json({ message: 'Abono registrado', nuevoAbonado, nuevoEstado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar pago' });
  }
};

// Eliminar factura
exports.deleteInvoice = async (req, res) => {
  const { id } = req.params;
  try {
    // Opcional: Verificar si tiene abonos antes de borrar, o borrar directo
    await db.query('DELETE FROM facturas_proveedores WHERE id = ?', [id]);
    res.json({ message: 'Factura eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar factura' });
  }
};