const pool = require('../config/db');

/* ═══════════════════════════════════════════════════════════════
   AUTO-MIGRACIÓN: Tabla creditos_cliente
   Se ejecuta al importar este módulo — idempotente.
   ═══════════════════════════════════════════════════════════════ */
(async () => {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS creditos_cliente (
        id INT AUTO_INCREMENT PRIMARY KEY,
        id_venta INT NOT NULL,
        id_cliente INT NOT NULL,
        monto_original DECIMAL(12,2) NOT NULL,
        saldo_restante DECIMAL(12,2) NOT NULL,
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
        estado ENUM('PENDIENTE','PAGADO','DEVUELTO') DEFAULT 'PENDIENTE',
        INDEX idx_cliente (id_cliente),
        INDEX idx_venta (id_venta)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

        // Migrar datos históricos: ventas a crédito que aún no tienen registro
        const [existing] = await pool.query('SELECT COUNT(*) as cnt FROM creditos_cliente');
        if (existing[0].cnt === 0) {
            // Solo migrar si la tabla está vacía (primera vez)
            const [creditSales] = await pool.query(`
        SELECT v.id_venta, v.id_cliente, v.total_venta, v.pago_detalles, v.fecha, v.estado
        FROM ventas v
        WHERE v.tipo_venta = 'CREDITO'
          AND v.estado = 'COMPLETADA'
          AND v.id_cliente IS NOT NULL
      `);

            for (const sale of creditSales) {
                let pd = sale.pago_detalles;
                if (typeof pd === 'string') { try { pd = JSON.parse(pd); } catch { pd = {}; } }
                const montoCredito = Number(pd?.credito || sale.total_venta || 0);
                if (montoCredito <= 0) continue;

                // Calcular cuánto se ha abonado a este cliente después de esta venta
                // Nota: los abonos no tienen id_venta de referencia en el sistema viejo
                // Así que insertamos el crédito con el saldo_restante = monto_original
                // y el saldo real del cliente queda controlado por clientes.saldo_pendiente
                await pool.query(
                    `INSERT IGNORE INTO creditos_cliente (id_venta, id_cliente, monto_original, saldo_restante, fecha, estado)
           VALUES (?, ?, ?, ?, ?, 'PENDIENTE')`,
                    [sale.id_venta, sale.id_cliente, montoCredito, montoCredito, sale.fecha]
                );
            }

            // Ahora recalcular saldo_restante basado en abonos existentes
            // Obtener total abonado por cada cliente
            const [abonos] = await pool.query(`
        SELECT v.id_cliente, SUM(ABS(v.total_venta)) as total_abonado
        FROM ventas v
        WHERE v.estado = 'ABONO_CREDITO' AND v.id_cliente IS NOT NULL
        GROUP BY v.id_cliente
      `);

            for (const abono of abonos) {
                let remaining = Number(abono.total_abonado);
                // Aplicar FIFO: pagar las facturas más antiguas primero
                const [tickets] = await pool.query(
                    `SELECT id, saldo_restante FROM creditos_cliente
           WHERE id_cliente = ? AND saldo_restante > 0
           ORDER BY fecha ASC`,
                    [abono.id_cliente]
                );

                for (const ticket of tickets) {
                    if (remaining <= 0) break;
                    const aplicar = Math.min(remaining, Number(ticket.saldo_restante));
                    const nuevoSaldo = Number(ticket.saldo_restante) - aplicar;
                    await pool.query(
                        `UPDATE creditos_cliente SET saldo_restante = ?, estado = ? WHERE id = ?`,
                        [nuevoSaldo, nuevoSaldo <= 0 ? 'PAGADO' : 'PENDIENTE', ticket.id]
                    );
                    remaining -= aplicar;
                }
            }

            console.log(`✅ Migración creditos_cliente: ${creditSales.length} registros procesados.`);
        }

        console.log('✅ Tabla creditos_cliente verificada.');
    } catch (err) {
        console.error('⚠️ Error creando tabla creditos_cliente:', err.message);
    }
})();

/* ═══════════════════════════════════════════════════════════════
   CRUD CLIENTES
   ═══════════════════════════════════════════════════════════════ */

const getAllClients = async (req, res) => {
    try {
        const [clients] = await pool.query(`
      SELECT c.id_cliente, c.nombre, c.telefono, c.direccion, c.limite_credito,
             COALESCE(c.saldo_pendiente, 0) as saldo_pendiente
      FROM clientes c ORDER BY c.nombre ASC
    `);
        res.json(clients.map(c => ({ ...c, saldo_pendiente: parseFloat(c.saldo_pendiente) })));
    } catch (error) {
        console.error("ERROR (getAllClients):", error);
        res.status(500).json({ message: 'Error en el servidor al obtener clientes' });
    }
};

const createClient = async (req, res) => {
    const { nombre, telefono, direccion, limite_credito } = req.body;
    if (!nombre) return res.status(400).json({ message: 'El nombre del cliente es obligatorio.' });
    try {
        const [result] = await pool.query(
            'INSERT INTO clientes (nombre, telefono, direccion, limite_credito) VALUES (?, ?, ?, ?)',
            [nombre, telefono || null, direccion || null, limite_credito]
        );
        res.status(201).json({ message: 'Cliente creado exitosamente', id: result.insertId });
    } catch (error) {
        console.error("ERROR (createClient):", error);
        res.status(500).json({ message: 'Error al crear cliente' });
    }
};

const updateClient = async (req, res) => {
    const { id } = req.params;
    const { nombre, telefono, direccion, limite_credito } = req.body;
    if (!nombre) return res.status(400).json({ message: 'El nombre del cliente es obligatorio.' });
    try {
        await pool.query(
            'UPDATE clientes SET nombre = ?, telefono = ?, direccion = ?, limite_credito = ? WHERE id_cliente = ?',
            [nombre, telefono || null, direccion || null, limite_credito, id]
        );
        res.status(200).json({ message: 'Cliente actualizado exitosamente' });
    } catch (error) {
        console.error("Error al actualizar cliente:", error);
        res.status(500).json({ message: 'Error al actualizar cliente' });
    }
};

const deleteClient = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT saldo_pendiente as saldo FROM clientes WHERE id_cliente = ?', [id]);
        if (rows.length > 0 && parseFloat(rows[0].saldo) > 0) {
            return res.status(400).json({ message: `No se puede eliminar. Saldo pendiente: C$${parseFloat(rows[0].saldo).toFixed(2)}.` });
        }
        await pool.query('DELETE FROM clientes WHERE id_cliente = ?', [id]);
        res.status(200).json({ message: 'Cliente eliminado exitosamente' });
    } catch (error) {
        console.error("Error al eliminar cliente:", error);
        res.status(500).json({ message: 'Error al eliminar cliente, puede que tenga facturas asociadas.' });
    }
};

/* ═══════════════════════════════════════════════════════════════
   CRÉDITOS: Abono con soporte por ticket (FIFO si no especifica)
   ═══════════════════════════════════════════════════════════════ */
const addCreditPayment = async (req, res) => {
    const { id } = req.params;           // id_cliente
    const { monto, pagoDetalles, id_venta } = req.body; // id_venta = ticket específico (opcional)
    const { id: userId } = req.user;
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Registrar abono en tabla ventas (igual que antes)
        const [abonoResult] = await connection.query(
            "INSERT INTO ventas (fecha, total_venta, estado, id_usuario, id_cliente, pago_detalles, tipo_venta) VALUES (NOW(), ?, 'ABONO_CREDITO', ?, ?, ?, 'CREDITO')",
            [monto * -1, userId, id, JSON.stringify(pagoDetalles)]
        );
        const abonoId = abonoResult.insertId;

        // 2. Reducir saldo_pendiente del cliente
        await connection.query(
            'UPDATE clientes SET saldo_pendiente = GREATEST(0, saldo_pendiente - ?) WHERE id_cliente = ?',
            [monto, id]
        );

        // 3. Aplicar a ticket(s) en creditos_cliente
        let remaining = Number(monto);

        if (id_venta) {
            // Abono dirigido a ticket específico
            const [ticket] = await connection.query(
                'SELECT id, saldo_restante FROM creditos_cliente WHERE id_venta = ? AND id_cliente = ? AND saldo_restante > 0 FOR UPDATE',
                [id_venta, id]
            );
            if (ticket.length > 0) {
                const aplicar = Math.min(remaining, Number(ticket[0].saldo_restante));
                const nuevoSaldo = Number(ticket[0].saldo_restante) - aplicar;
                await connection.query(
                    'UPDATE creditos_cliente SET saldo_restante = ?, estado = ? WHERE id = ?',
                    [nuevoSaldo, nuevoSaldo <= 0 ? 'PAGADO' : 'PENDIENTE', ticket[0].id]
                );
                remaining -= aplicar;
            }
        }

        // Si sobra monto (o no se especificó ticket), aplicar FIFO
        if (remaining > 0) {
            const [pendientes] = await connection.query(
                'SELECT id, saldo_restante FROM creditos_cliente WHERE id_cliente = ? AND saldo_restante > 0 ORDER BY fecha ASC FOR UPDATE',
                [id]
            );
            for (const t of pendientes) {
                if (remaining <= 0) break;
                const aplicar = Math.min(remaining, Number(t.saldo_restante));
                const nuevoSaldo = Number(t.saldo_restante) - aplicar;
                await connection.query(
                    'UPDATE creditos_cliente SET saldo_restante = ?, estado = ? WHERE id = ?',
                    [nuevoSaldo, nuevoSaldo <= 0 ? 'PAGADO' : 'PENDIENTE', t.id]
                );
                remaining -= aplicar;
            }
        }

        await connection.commit();
        res.status(200).json({ message: 'Abono registrado exitosamente.', abonoId });
    } catch (error) {
        await connection.rollback();
        console.error("ERROR en addCreditPayment:", error);
        res.status(500).json({ message: 'Error al registrar el abono.', error: error.message });
    } finally {
        if (connection) connection.release();
    }
};

/* ═══════════════════════════════════════════════════════════════
   CONSULTAS DE CRÉDITO
   ═══════════════════════════════════════════════════════════════ */

// Obtener ventas a crédito del cliente (historial)
const getCreditosByClient = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query(`
      SELECT v.id_venta, v.fecha, v.total_venta AS total, v.estado, v.pago_detalles AS pagoDetalles
      FROM ventas v
      WHERE v.id_cliente = ? AND v.tipo_venta = 'CREDITO' AND v.estado = 'COMPLETADA'
      ORDER BY v.fecha DESC
    `, [id]);
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener créditos:", error);
        res.status(500).json({ message: "Error al obtener créditos del cliente" });
    }
};

// Obtener abonos del cliente
const getAbonosByClient = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query(`
      SELECT v.id_venta AS id_abono, v.fecha, ABS(v.total_venta) AS monto, 
             u.nombre_usuario AS usuario, v.pago_detalles AS pagoDetalles
      FROM ventas v
      LEFT JOIN usuarios u ON v.id_usuario = u.id_usuario
      WHERE v.id_cliente = ? AND v.estado = 'ABONO_CREDITO'
      ORDER BY v.fecha DESC
    `, [id]);
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener abonos:", error);
        res.status(500).json({ message: "Error al obtener abonos del cliente" });
    }
};

// NUEVO: Facturas pendientes (con saldo_restante > 0) para el modal de abono
const getCreditosPendientes = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query(`
      SELECT cc.id, cc.id_venta, cc.monto_original, cc.saldo_restante, cc.fecha, cc.estado,
             v.total_venta, v.pago_detalles AS pagoDetalles
      FROM creditos_cliente cc
      LEFT JOIN ventas v ON cc.id_venta = v.id_venta
      WHERE cc.id_cliente = ? 
      ORDER BY cc.fecha ASC
    `, [id]);

        const parsed = rows.map(r => {
            let pd = r.pagoDetalles;
            if (typeof pd === 'string') { try { pd = JSON.parse(pd); } catch { pd = {}; } }
            return {
                id: r.id,
                idVenta: r.id_venta,
                montoOriginal: Number(r.monto_original),
                saldoRestante: Number(r.saldo_restante),
                fecha: r.fecha,
                estado: r.estado,
                totalVenta: Number(r.total_venta),
                pagoDetalles: pd
            };
        });

        res.json(parsed);
    } catch (error) {
        console.error("Error al obtener créditos pendientes:", error);
        res.status(500).json({ message: "Error al obtener créditos pendientes" });
    }
};

module.exports = {
    getAllClients,
    createClient,
    updateClient,
    deleteClient,
    addCreditPayment,
    getCreditosByClient,
    getAbonosByClient,
    getCreditosPendientes,
};