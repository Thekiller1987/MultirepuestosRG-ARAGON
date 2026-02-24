// CommonJS
const express = require('express');
const pool = require('../config/db'); // MySQL Pool

const router = express.Router();

/* ───────── Utils ───────── */
function displayName(u) {
  if (!u) return '—';
  if (typeof u === 'string') return u;
  return (
    u.name ||
    u.nombre ||
    u.fullName ||
    u.displayName ||
    u.nombre_usuario ||
    u.username ||
    (u.user && (u.user.name || u.user.username || u.user.displayName)) ||
    (u.id ? `Usuario ${u.id}` : '—')
  );
}

function normalizeUser(u, fallbackId) {
  const base = (u && typeof u === 'object') ? { ...u } : {};
  const id = String(base.id ?? fallbackId ?? '').trim();
  const name =
    base.name ??
    base.nombre ??
    base.fullName ??
    base.displayName ??
    base.nombre_usuario ??
    base.username ??
    (id ? `Usuario ${id}` : undefined);

  return {
    ...base,
    ...(id ? { id } : {}),
    ...(name ? { name } : {}),
  };
}

function localDayKey(isoOrDate) {
  if (!isoOrDate) return null;
  const d = (isoOrDate instanceof Date) ? isoOrDate : new Date(isoOrDate);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

// ───────── PREVENCIÓN DE ERRORES: AUTOCORRECCIÓN DE BASE DE DATOS ─────────
async function ensureSchema() {
  try {
    // 1. Crear tabla cierres_caja si no existe
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cierres_caja (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fecha_apertura DATETIME NOT NULL,
        fecha_cierre DATETIME NULL DEFAULT NULL,
        usuario_id INT NOT NULL,
        usuario_nombre VARCHAR(255) DEFAULT '',
        monto_inicial DECIMAL(12,2) DEFAULT 0,
        final_esperado DECIMAL(12,2) DEFAULT 0,
        final_real DECIMAL(12,2) DEFAULT 0,
        diferencia DECIMAL(12,2) DEFAULT 0,
        total_ventas_efectivo DECIMAL(12,2) DEFAULT 0,
        total_ventas_tarjeta DECIMAL(12,2) DEFAULT 0,
        total_ventas_transferencia DECIMAL(12,2) DEFAULT 0,
        total_ventas_credito DECIMAL(12,2) DEFAULT 0,
        total_dolares DECIMAL(12,2) DEFAULT 0,
        total_entradas DECIMAL(12,2) DEFAULT 0,
        total_salidas DECIMAL(12,2) DEFAULT 0,
        observaciones TEXT,
        detalles_json JSON,
        INDEX idx_usuario (usuario_id),
        INDEX idx_fecha_apertura (fecha_apertura),
        INDEX idx_fecha_cierre (fecha_cierre)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 1b. Agregar columna total_dolares si no existe (migración)
    try {
      await pool.query(`ALTER TABLE cierres_caja ADD COLUMN total_dolares DECIMAL(12,2) DEFAULT 0 AFTER total_ventas_credito;`);
    } catch (e) {
      // Ignoramos si ya existe
    }

    // 2. Crear tabla de carritos si no existe
    await pool.query(`
      CREATE TABLE IF NOT EXISTS active_carts (
        user_id INT PRIMARY KEY,
        carts_json JSON,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    // 3. Corregir tabla cierres_caja para permitir NULL en fecha_cierre
    try {
      await pool.query(`ALTER TABLE cierres_caja MODIFY COLUMN fecha_cierre DATETIME NULL DEFAULT NULL;`);
    } catch (e) {
      // Ignoramos error si ya es NULL
    }

    console.log('✅ Esquema de caja verificado/creado correctamente.');
  } catch (error) {
    console.error('❌ Error fatal verificando esquema DB:', error);
  }
}

// Ejecutar corrección al cargar el archivo
ensureSchema();

// ───────── Helper: Calcular totales de sesión desde transacciones ─────────
function calcularTotalesSesion(transactions, details) {
  let totalEfectivo = 0, totalTarjeta = 0, totalTransferencia = 0, totalCredito = 0;
  let totalDolares = 0, totalIngresos = 0, totalGastos = 0;
  let movimientoNetoEfectivo = 0;

  (transactions || []).forEach(tx => {
    const tipo = (tx.type || '').toLowerCase();
    const d = tx.pagoDetalles || {};

    // VENTAS
    if (tipo.startsWith('venta')) {
      totalEfectivo += Number(d.efectivo || 0);
      totalTarjeta += Number(d.tarjeta || 0);
      totalTransferencia += Number(d.transferencia || 0);
      totalCredito += Number(d.credito || 0);
      totalDolares += Number(d.dolares || 0);

      // Cálculo efectivo neto
      const cashIn = Number(d.efectivo || 0);
      const dolaresVal = Number(d.dolares || 0);
      const tasa = Number(d.tasaDolarAlMomento || details?.tasaDolar || 1);
      const cashOut = Number(d.cambio || 0);
      if (!d.efectivo && !d.dolares) {
        movimientoNetoEfectivo += Number(d.ingresoCaja || 0);
      } else {
        movimientoNetoEfectivo += (cashIn + (dolaresVal * tasa)) - cashOut;
      }
    }
    // ABONOS
    else if (tipo.includes('abono')) {
      if (d.efectivo) totalEfectivo += Number(d.efectivo || 0);
      else if (d.ingresoCaja > 0) totalEfectivo += Number(d.ingresoCaja || 0);
      if (d.tarjeta) totalTarjeta += Number(d.tarjeta || 0);
      if (d.transferencia) totalTransferencia += Number(d.transferencia || 0);
      if (d.dolares) {
        totalDolares += Number(d.dolares || 0);
        movimientoNetoEfectivo += (Number(d.efectivo || 0) + (Number(d.dolares || 0) * Number(details?.tasaDolar || 1)));
      } else {
        movimientoNetoEfectivo += Number(d.ingresoCaja || 0);
      }
    }
    // ENTRADAS
    else if (tipo === 'entrada') {
      const m = Number(tx.amount || 0);
      totalIngresos += m;
      movimientoNetoEfectivo += m;
    }
    // SALIDAS
    else if (tipo === 'salida') {
      const m = Number(tx.amount || 0);
      totalGastos += m;
      movimientoNetoEfectivo -= m;
    }
    // DEVOLUCIONES / CANCELACIONES / ANULACIONES
    else if (tipo.includes('devolucion') || tipo.includes('cancelacion') || tipo.includes('anulacion')) {
      totalEfectivo -= Number(d.efectivo || 0);
      totalTarjeta -= Number(d.tarjeta || 0);
      totalTransferencia -= Number(d.transferencia || 0);
      totalCredito -= Number(d.credito || 0);
      totalDolares -= Number(d.dolares || 0);
      let impacto = Number(d.ingresoCaja || tx.amount || 0);
      if (impacto > 0) impacto = -impacto;
      movimientoNetoEfectivo += impacto;
    }
    // AJUSTES SECRETOS
    else if (tipo === 'ajuste') {
      const monto = Number(tx.amount || 0);
      if (d.target === 'efectivo') movimientoNetoEfectivo += monto;
      else if (d.target === 'credito') totalCredito += monto;
      else if (d.target === 'tarjeta') totalTarjeta += monto;
      else if (d.target === 'transferencia') totalTransferencia += monto;
      else if (d.target === 'dolares') totalDolares += monto;
    }
  });

  return { totalEfectivo, totalTarjeta, totalTransferencia, totalCredito, totalDolares, totalIngresos, totalGastos, movimientoNetoEfectivo };
}

// ───────── Sesiones de Caja (SQL ONLY) ─────────

// Helper: Reconstruir objeto de sesión desde fila SQL
function mapRowToSession(row) {
  if (!row) return null;
  let details = {};
  try {
    details = (typeof row.detalles_json === 'string')
      ? JSON.parse(row.detalles_json)
      : (row.detalles_json || { transactions: [] });
  } catch (e) {
    details = { transactions: [] };
  }

  return {
    id: row.id, // ID numérico de SQL
    sqlId: row.id,
    openedAt: row.fecha_apertura,
    openedBy: { id: row.usuario_id, name: row.usuario_nombre },
    initialAmount: Number(row.monto_inicial || 0),
    transactions: details.transactions || [],
    closedAt: row.fecha_cierre, // Será null si está abierta
    closedBy: row.fecha_cierre ? { id: row.usuario_id, name: row.usuario_nombre } : null,
    countedAmount: row.final_real ? Number(row.final_real) : null,
    difference: row.diferencia ? Number(row.diferencia) : null,
    tasaDolar: Number(details.tasaDolar || 0),
    totalDolares: Number(row.total_dolares || 0),
    notes: row.observaciones || ''
  };
}

// GET /api/caja/session?userId=123
router.get('/session', async (req, res) => {
  const userId = String(req.query.userId || '').trim();
  if (!userId) return res.status(400).json({ message: 'Falta userId' });

  try {
    // 1. Buscar sesión ABIERTA en SQL
    const [openRows] = await pool.query(`
      SELECT * FROM cierres_caja 
      WHERE usuario_id = ? AND fecha_cierre IS NULL 
      ORDER BY fecha_apertura DESC LIMIT 1
    `, [userId]);

    if (openRows.length > 0) {
      return res.json(mapRowToSession(openRows[0]));
    }

    // 2. Si no hay abierta, buscar la última CERRADA (para UI de "abrir caja")
    const [lastRows] = await pool.query(`
      SELECT * FROM cierres_caja 
      WHERE usuario_id = ? AND fecha_cierre IS NOT NULL 
      ORDER BY fecha_cierre DESC LIMIT 1
    `, [userId]);

    if (lastRows.length > 0) {
      return res.json(mapRowToSession(lastRows[0]));
    }

    return res.json(null);

  } catch (error) {
    console.error('Error GET /session:', error);
    res.status(500).json({ message: 'Error recuperando sesión: ' + error.message });
  }
});

// POST /api/caja/session/open
router.post('/session/open', async (req, res) => {
  const { userId, openedAt, openedBy, initialAmount = 0, tasaDolar } = req.body || {};
  if (!userId || !openedAt || !openedBy) {
    return res.status(400).json({ message: 'Faltan campos: userId, openedAt, openedBy' });
  }

  try {
    // 1. Verificar si ya tiene una abierta (Idempotencia DB)
    const [existing] = await pool.query(`
      SELECT * FROM cierres_caja 
      WHERE usuario_id = ? AND fecha_cierre IS NULL 
      LIMIT 1
    `, [userId]);

    if (existing.length > 0) {
      return res.json(mapRowToSession(existing[0]));
    }

    // 2. Crear nueva sesión en SQL
    const usuarioNombre = displayName(openedBy);
    const initialJson = JSON.stringify({
      transactions: [],
      session_id_legacy: `caja-${userId}-${Date.now()}`, // Solo referencia
      tasaDolar: Number(tasaDolar || 0)
    });

    const [result] = await pool.query(`
      INSERT INTO cierres_caja (
        fecha_apertura, fecha_cierre, usuario_id, usuario_nombre, 
        monto_inicial, final_esperado, final_real, diferencia,
        total_ventas_efectivo, total_ventas_tarjeta, total_ventas_transferencia, total_ventas_credito,
        total_entradas, total_salidas, detalles_json
      ) VALUES (?, NULL, ?, ?, ?, 0, 0, 0, 0, 0, 0, 0, 0, 0, ?)
    `, [
      new Date(openedAt), userId, usuarioNombre,
      initialAmount, initialJson
    ]);

    // Devolver objeto sesión completo
    const newSession = {
      id: result.insertId,
      openedAt,
      openedBy: { id: userId, name: usuarioNombre },
      initialAmount: Number(initialAmount),
      transactions: [],
      tasaDolar: Number(tasaDolar || 0),
      closedAt: null
    };

    res.status(201).json(newSession);

  } catch (error) {
    console.error('Error POST /session/open:', error);
    // CRITICAL DEBUG: Return the exact SQL error message to the frontend
    res.status(500).json({ message: 'Error SQL: ' + error.message, sqlError: error.code });
  }
});

// POST /api/caja/session/tx
router.post('/session/tx', async (req, res) => {
  const { userId, tx } = req.body || {};
  if (!userId || !tx) return res.status(400).json({ message: 'Faltan userId o tx' });

  try {
    // 1. Obtener sesión abierta
    const [rows] = await pool.query(`
      SELECT * FROM cierres_caja 
      WHERE usuario_id = ? AND fecha_cierre IS NULL 
      LIMIT 1
    `, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No hay sesión abierta' });
    }

    const row = rows[0];
    let details = {};
    try {
      details = (typeof row.detalles_json === 'string')
        ? JSON.parse(row.detalles_json)
        : (row.detalles_json || {});
    } catch { details = {}; }

    if (!details.transactions) details.transactions = [];

    // 2. Agregar transacción
    details.transactions.push({
      id: tx.id || `tx-${Date.now()}`,
      type: tx.type,
      amount: Number(tx.amount || 0),
      note: tx.note || '',
      at: tx.at || new Date().toISOString(),
      pagoDetalles: tx.pagoDetalles || {}
    });

    // 3. Recalcular totales corridos desde TODAS las transacciones
    const totals = calcularTotalesSesion(details.transactions, details);

    // 4. Guardar JSON + totales actualizados en BD (cada tx actualiza las columnas)
    await pool.query(`
      UPDATE cierres_caja 
      SET detalles_json = ?,
          total_ventas_efectivo = ?,
          total_ventas_tarjeta = ?,
          total_ventas_transferencia = ?,
          total_ventas_credito = ?,
          total_dolares = ?,
          total_entradas = ?,
          total_salidas = ?
      WHERE id = ?
    `, [
      JSON.stringify(details),
      totals.totalEfectivo, totals.totalTarjeta, totals.totalTransferencia,
      totals.totalCredito, totals.totalDolares,
      totals.totalIngresos, totals.totalGastos,
      row.id
    ]);

    // 5. Devolver sesión actualizada
    res.status(201).json(mapRowToSession({ ...row, detalles_json: details }));

  } catch (error) {
    console.error('Error POST /session/tx:', error);
    res.status(500).json({ message: 'Error guardando transacción: ' + error.message });
  }
});

// POST /api/caja/session/close
router.post('/session/close', async (req, res) => {
  const { userId, countedAmount = 0, closedAt, closedBy, notes } = req.body || {};
  if (!userId || !closedAt || !closedBy) {
    return res.status(400).json({ message: 'Faltan campos: userId, closedAt, closedBy' });
  }

  try {
    // 1. Buscar sesión abierta
    const [rows] = await pool.query(`
      SELECT * FROM cierres_caja 
      WHERE usuario_id = ? AND fecha_cierre IS NULL 
      LIMIT 1
    `, [userId]);

    if (rows.length === 0) {
      console.warn(`[Cierre] No se encontró sesión abierta para usuario ${userId}. Buscando recientes...`);
      // check if it was just closed?
      const [lastClosed] = await pool.query(`
        SELECT * FROM cierres_caja 
        WHERE usuario_id = ? AND fecha_cierre IS NOT NULL 
        ORDER BY fecha_cierre DESC LIMIT 1
      `, [userId]);

      if (lastClosed.length > 0) {
        const diff = Date.now() - new Date(lastClosed[0].fecha_cierre).getTime();
        if (diff < 60000) {
          console.log('[Cierre] Sesión ya estaba cerrada hace < 1min. Retornando éxito.');
          return res.json({ success: true, message: 'Sesión ya cerrada (Idempotente)', ...mapRowToSession(lastClosed[0]) });
        }
      }
      // CRITICAL CHANGE: Return 404 to alert frontend instead of silent "success"
      return res.status(404).json({ message: 'No se encontró una sesión abierta para cerrar. Refresca la página.' });
    }

    const row = rows[0];
    let details = {};
    try {
      details = (typeof row.detalles_json === 'string')
        ? JSON.parse(row.detalles_json)
        : (row.detalles_json || {});
    } catch { details = { transactions: [] }; }

    const transactions = details.transactions || [];

    // 2. Calcular totales finales usando helper compartido
    const totals = calcularTotalesSesion(transactions, details);

    const montoInicial = Number(row.monto_inicial || 0);
    const finalEsperado = montoInicial + totals.movimientoNetoEfectivo;
    const finalReal = Number(countedAmount);
    const diferencia = finalReal - finalEsperado;

    // 3. Actualizar la fila (Cierre definitivo)
    await pool.query(`
      UPDATE cierres_caja SET
        fecha_cierre = ?,
        final_esperado = ?,
        final_real = ?,
        diferencia = ?,
        total_ventas_efectivo = ?,
        total_ventas_tarjeta = ?,
        total_ventas_transferencia = ?,
        total_ventas_credito = ?,
        total_dolares = ?,
        total_entradas = ?,
        total_salidas = ?,
        observaciones = ?
      WHERE id = ?
    `, [
      new Date(closedAt), finalEsperado, finalReal, diferencia,
      totals.totalEfectivo, totals.totalTarjeta, totals.totalTransferencia, totals.totalCredito,
      totals.totalDolares,
      totals.totalIngresos, totals.totalGastos,
      notes || '',
      row.id
    ]);

    // Responder éxito
    res.json({ success: true, message: 'Cierre guardado en BD', id: row.id, ...mapRowToSession({ ...row, fecha_cierre: closedAt }) });

  } catch (error) {
    console.error('Error POST /session/close:', error);
    res.status(500).json({ message: 'Error SQL: ' + error.message, sqlError: error.code });
  }
});


// ───────── Reporte (MIGRADO A SQL) ─────────
// GET /api/caja/reporte?date=YYYY-MM-DD
router.get('/reporte', async (req, res) => {
  const dateStr = (req.query.date || localDayKey(new Date())).trim(); // YYYY-MM-DD

  try {
    // 1. Obtener Cierres Completados desde SQL
    const [rows] = await pool.query(`
      SELECT * FROM cierres_caja 
      WHERE DATE(DATE_SUB(fecha_apertura, INTERVAL 6 HOUR)) = ?
      ORDER BY fecha_cierre DESC
    `, [dateStr]);

    const cerradas = rows.map(r => ({
      id: r.id,
      sql: true,
      abierta_por: r.usuario_nombre,
      cerrada_por: r.usuario_nombre,
      hora_apertura: r.fecha_apertura,
      hora_cierre: r.fecha_cierre,
      monto_inicial: Number(r.monto_inicial),
      esperado: Number(r.final_esperado),
      contado: Number(r.final_real),
      diferencia: Number(r.diferencia),
      total_efectivo: Number(r.total_ventas_efectivo),
      total_tarjeta: Number(r.total_ventas_tarjeta),
      total_transferencia: Number(r.total_ventas_transferencia),
      total_credito: Number(r.total_ventas_credito),
      total_dolares: Number(r.total_dolares || 0),
      total_gastos: Number(r.total_salidas),
      total_ingresos: Number(r.total_entradas),
      detalles_json: r.detalles_json
    }));

    // 2. Obtener Sesiones ABIERTAS desde SQL
    const [activeRows] = await pool.query(`
      SELECT * FROM cierres_caja 
      WHERE fecha_cierre IS NULL
      AND DATE(DATE_SUB(fecha_apertura, INTERVAL 6 HOUR)) = ?
    `, [dateStr]);

    const abiertas = activeRows.map(r => ({
      id: r.id,
      abierta_por: r.usuario_nombre,
      hora_apertura: r.fecha_apertura,
      monto_inicial: Number(r.monto_inicial || 0)
    }));

    // Retorno limpio, SIN legacy JSON merging.
    res.json({ abiertas, cerradas });

  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Error cargando reportes: ' + error.message });
  }
});

// GET /api/caja/abiertas/activas (Para CashReport: mostrar quién está trabajando)
router.get('/abiertas/activas', async (req, res) => {
  try {
    // Consulta SQL directa
    const [rows] = await pool.query(`
      SELECT * FROM cierres_caja 
      WHERE fecha_cierre IS NULL
    `);

    const abiertas = rows.map(row => {
      let details = {};
      try {
        details = (typeof row.detalles_json === 'string')
          ? JSON.parse(row.detalles_json)
          : (row.detalles_json || {});
      } catch { details = {}; }

      return {
        id: row.id,
        openedAt: row.fecha_apertura,
        hora_apertura: row.fecha_apertura,
        openedBy: { id: row.usuario_id, name: row.usuario_nombre },
        monto_inicial: Number(row.monto_inicial || 0),
        tasaDolar: Number(details.tasaDolar || 0),
        abierta_por: row.usuario_nombre,
        usuario_id: row.usuario_id,
      };
    });

    abiertas.sort((a, b) => new Date(b.openedAt) - new Date(a.openedAt));
    res.json({ abiertas });

  } catch (error) {
    console.error('Error getting active sessions:', error);
    res.status(500).json({ message: 'Error obteniendo sesiones activas', abiertas: [] });
  }
});

// ───────── Active Carts (Persistence) ─────────
// GET /api/caja/cart?userId=123
router.get('/cart', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ message: 'Missing userId' });

  try {
    const [rows] = await pool.query('SELECT carts_json FROM active_carts WHERE user_id = ?', [userId]);
    if (rows.length > 0) {
      let data = rows[0].carts_json;
      if (typeof data === 'string') {
        try { data = JSON.parse(data); } catch (e) { }
      }
      return res.json(data);
    }
    return res.json([]);
  } catch (error) {
    console.error('Error fetching cart:', error);
    // Return empty if table doesn't exist yet to avoid crashing app
    res.json([]);
  }
});

// POST /api/caja/cart
router.post('/cart', async (req, res) => {
  const { userId, carts } = req.body;
  if (!userId || !carts) return res.status(400).json({ message: 'Missing data' });

  try {
    const jsonStr = JSON.stringify(carts);
    await pool.query(`
      INSERT INTO active_carts (user_id, carts_json) VALUES (?, ?)
      ON DUPLICATE KEY UPDATE carts_json = VALUES(carts_json)
    `, [userId, jsonStr]);

    res.json({ success: true });
  } catch (error) {
    console.error('Error saving cart:', error);
    res.status(500).json({ message: 'Error saving cart' });
  }
});

module.exports = router;
