/**
 * @file mayoristaController.js
 * @description Controlador integral para el Módulo Mayorista:
 * 1. Catálogo Mayorista interactivo (con validación de precio de ruta obligatoria).
 * 2. Precios de ruta, descuentos, promociones y combos.
 * 3. Inventario en Ruta ("lo que lleva el muchacho en la ruta"): Cargas, Stock en furgón y Liquidaciones.
 * 4. Clientes de Ruta Mayorista (con zonas y créditos).
 * 5. Facturación y Facturas exclusivas de Ruta Mayorista.
 */

const db = require('../config/db.js');

/* =========================================================================
   1. AUTO-MIGRATE: Estructura de BD completa para Mayoristas y Rutas
========================================================================= */
const initMayoristaModule = async () => {
  try {
    console.log('🔄 Sincronizando esquema del Módulo Mayorista...');

    // 1. Columnas en productos
    const [prodCols] = await db.query('SHOW COLUMNS FROM productos');
    const prodFields = prodCols.map(c => c.Field);

    try {
      if (!prodFields.includes('catalogo_mayorista')) {
        await db.query('ALTER TABLE productos ADD COLUMN catalogo_mayorista TINYINT(1) NOT NULL DEFAULT 0');
      }
    } catch (e) { console.warn('Col catalogo_mayorista:', e.message); }

    try {
      if (!prodFields.includes('precio_ruta')) {
        await db.query('ALTER TABLE productos ADD COLUMN precio_ruta DECIMAL(10,2) NULL DEFAULT 0.00');
        if (prodFields.includes('mayoreo')) {
          await db.query('UPDATE productos SET precio_ruta = mayoreo WHERE mayoreo > 0 AND (precio_ruta IS NULL OR precio_ruta = 0)');
        }
      }
    } catch (e) { console.warn('Col precio_ruta:', e.message); }

    try {
      if (!prodFields.includes('descuento_mayorista')) {
        await db.query('ALTER TABLE productos ADD COLUMN descuento_mayorista DECIMAL(5,2) NULL DEFAULT 0.00');
      }
    } catch (e) { console.warn('Col descuento_mayorista:', e.message); }

    try {
      if (!prodFields.includes('promocion_mayorista')) {
        await db.query('ALTER TABLE productos ADD COLUMN promocion_mayorista VARCHAR(255) NULL');
      }
    } catch (e) { console.warn('Col promocion_mayorista:', e.message); }

    try {
      if (!prodFields.includes('combo_mayorista')) {
        await db.query('ALTER TABLE productos ADD COLUMN combo_mayorista VARCHAR(255) NULL');
      }
    } catch (e) { console.warn('Col combo_mayorista:', e.message); }

    // 2. Columnas en clientes para diferenciar clientes de ruta
    const [clientCols] = await db.query('SHOW COLUMNS FROM clientes');
    const clientFields = clientCols.map(c => c.Field);

    if (!clientFields.includes('tipo_cliente')) {
      await db.query("ALTER TABLE clientes ADD COLUMN tipo_cliente VARCHAR(50) NOT NULL DEFAULT 'GENERAL'");
    }
    if (!clientFields.includes('zona_ruta')) {
      await db.query('ALTER TABLE clientes ADD COLUMN zona_ruta VARCHAR(150) NULL');
    }
    if (!clientFields.includes('saldo_pendiente')) {
      await db.query('ALTER TABLE clientes ADD COLUMN saldo_pendiente DECIMAL(10,2) NOT NULL DEFAULT 0.00');
    }

    // 3. Tabla de Cargas de Ruta (despacho al muchacho que se monta a la ruta)
    await db.query(`
      CREATE TABLE IF NOT EXISTS cargas_ruta (
        id_carga INT AUTO_INCREMENT PRIMARY KEY,
        id_empleado INT NULL,
        nombre_rutero VARCHAR(150) NOT NULL,
        vehiculo_ruta VARCHAR(100) NULL,
        zona VARCHAR(150) NULL,
        fecha_salida DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        fecha_liquidacion DATETIME NULL,
        estado ENUM('EN_RUTA', 'LIQUIDADA', 'CANCELADA') NOT NULL DEFAULT 'EN_RUTA',
        total_items INT NOT NULL DEFAULT 0,
        total_valor_ruta DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        total_vendido DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        total_recaudado DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        porcentaje_comision DECIMAL(5,2) NOT NULL DEFAULT 0.00,
        monto_comision DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        comision_pagada TINYINT(1) NOT NULL DEFAULT 0,
        notas TEXT NULL,
        id_usuario_creo INT NULL,
        INDEX (estado),
        INDEX (id_empleado)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // Verificar y añadir columnas de comisiones si no existen
    const [cargasCols] = await db.query('SHOW COLUMNS FROM cargas_ruta');
    const cargasFields = cargasCols.map(c => c.Field);
    if (!cargasFields.includes('porcentaje_comision')) {
      await db.query('ALTER TABLE cargas_ruta ADD COLUMN porcentaje_comision DECIMAL(5,2) NOT NULL DEFAULT 0.00 AFTER total_recaudado');
    }
    if (!cargasFields.includes('monto_comision')) {
      await db.query('ALTER TABLE cargas_ruta ADD COLUMN monto_comision DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER porcentaje_comision');
    }
    if (!cargasFields.includes('comision_pagada')) {
      await db.query('ALTER TABLE cargas_ruta ADD COLUMN comision_pagada TINYINT(1) NOT NULL DEFAULT 0 AFTER monto_comision');
    }

    // 4. Detalle de Items en la Carga de Ruta
    await db.query(`
      CREATE TABLE IF NOT EXISTS cargas_ruta_detalle (
        id_detalle_carga INT AUTO_INCREMENT PRIMARY KEY,
        id_carga INT NOT NULL,
        id_producto INT NOT NULL,
        cantidad_cargada INT NOT NULL,
        cantidad_vendida INT NOT NULL DEFAULT 0,
        cantidad_devuelta INT NOT NULL DEFAULT 0,
        precio_ruta_unitario DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        costo_unitario DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        INDEX (id_carga),
        INDEX (id_producto),
        CONSTRAINT fk_cargas_detalle FOREIGN KEY (id_carga) REFERENCES cargas_ruta(id_carga) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // 5. Vincular ventas con carga de ruta si aplica
    const [ventasCols] = await db.query('SHOW COLUMNS FROM ventas');
    const ventasFields = ventasCols.map(c => c.Field);
    if (!ventasFields.includes('id_carga')) {
      await db.query('ALTER TABLE ventas ADD COLUMN id_carga INT NULL');
    }
    if (!ventasFields.includes('tipo_venta')) {
      await db.query("ALTER TABLE ventas ADD COLUMN tipo_venta VARCHAR(50) NOT NULL DEFAULT 'NORMAL'");
    }
    if (!ventasFields.includes('numero_factura')) {
      await db.query('ALTER TABLE ventas ADD COLUMN numero_factura VARCHAR(50) NULL');
    }

    console.log('✅ Esquema del Módulo Mayorista sincronizado con éxito.');
  } catch (error) {
    console.warn('⚠️ Nota al inicializar módulo mayorista:', error.message);
  }
};

/* =========================================================================
   2. CATÁLOGO MAYORISTA Y PRODUCTOS
======================================================================== */

// Obtener todos los productos para la administración mayorista
const getAllMayoristaProducts = async (req, res) => {
  try {
    let rows = [];
    try {
      const [prodCols] = await db.query('SHOW COLUMNS FROM productos');
      const prodFields = prodCols.map(c => c.Field);
      const selectFields = prodFields
        .map(f => `p.\`${f}\``)
        .join(', ');

      const hasActivo = prodFields.includes('activo');
      const activoFilter = hasActivo ? '(p.activo = 1 OR p.activo IS NULL)' : '1=1';
      const hasCat = prodFields.includes('id_categoria');
      const hasProv = prodFields.includes('id_proveedor');

      const query = `
        SELECT 
          ${selectFields}
          ${hasCat ? ', c.nombre AS nombre_categoria' : ''}
          ${hasProv ? ', pr.nombre AS nombre_proveedor' : ''}
        FROM productos p
        ${hasCat ? 'LEFT JOIN categorias c ON p.id_categoria = c.id_categoria' : ''}
        ${hasProv ? 'LEFT JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor' : ''}
        WHERE ${activoFilter}
        ORDER BY p.nombre ASC
      `;
      const [qRows] = await db.query(query);
      rows = qRows;
    } catch (sqlErr) {
      console.warn('Fallback en getAllMayoristaProducts:', sqlErr.message);
      const [fallbackRows] = await db.query('SELECT * FROM productos LIMIT 5000');
      rows = fallbackRows;
    }

    const requestingUserId = req.user?.id_usuario || req.user?.id;
    let reservedMap = new Map();
    try {
      const [carts] = await db.query(
        "SELECT carts_json FROM active_carts WHERE updated_at > NOW() - INTERVAL 60 MINUTE AND user_id != ?",
        [requestingUserId || -1]
      );
      carts.forEach(c => {
        try {
          let items = typeof c.carts_json === 'string' ? JSON.parse(c.carts_json) : c.carts_json;
          if (Array.isArray(items)) {
            items.forEach(t => {
              if (t.items && Array.isArray(t.items)) {
                t.items.forEach(it => {
                  const pid = it.id_producto || it.id;
                  const qty = Number(it.quantity || it.cantidad || 0);
                  reservedMap.set(pid, (reservedMap.get(pid) || 0) + qty);
                });
              }
            });
          }
        } catch(e) {}
      });
    } catch(e) {}

    const products = rows.map(p => {
      const pid = p.id_producto;
      const reserved = reservedMap.get(pid) || 0;
      return {
        ...p,
        existencia: Math.max(0, (p.existencia || 0) - reserved),
        reserved,
        precio_ruta: p.precio_ruta !== undefined && p.precio_ruta !== null ? p.precio_ruta : (p.mayorista || p.mayoreo || 0),
        catalogo_mayorista: p.catalogo_mayorista !== undefined && p.catalogo_mayorista !== null ? p.catalogo_mayorista : 0,
        imagen: p.imagen ? (Buffer.isBuffer(p.imagen) ? p.imagen.toString('utf-8') : p.imagen) : null
      };
    });

    res.json(products);
  } catch (error) {
    console.error('Error en getAllMayoristaProducts:', error);
    res.status(500).json({ msg: 'Error al obtener productos para módulo mayorista.', error: error.message });
  }
};

// Obtener catálogo activo para PDF / visualización
const getCatalogProducts = async (req, res) => {
  try {
    const [prodCols] = await db.query('SHOW COLUMNS FROM productos');
    const prodFields = prodCols.map(c => c.Field);
    if (!prodFields.includes('catalogo_mayorista')) {
      return res.json([]);
    }

    let rows = [];
    try {
      const selectFields = prodFields
        .map(f => `p.\`${f}\``)
        .join(', ');

      const hasActivo = prodFields.includes('activo');
      const activoFilter = hasActivo ? '(p.activo = 1 OR p.activo IS NULL) AND' : '';
      const hasCat = prodFields.includes('id_categoria');

      const query = `
        SELECT 
          ${selectFields}
          ${hasCat ? ', c.nombre AS nombre_categoria' : ''}
        FROM productos p
        ${hasCat ? 'LEFT JOIN categorias c ON p.id_categoria = c.id_categoria' : ''}
        WHERE ${activoFilter} p.catalogo_mayorista = 1
        ORDER BY p.nombre ASC
      `;
      const [qRows] = await db.query(query);
      rows = qRows;
    } catch (sqlErr) {
      console.warn('Fallback en getCatalogProducts:', sqlErr.message);
      const [fallbackRows] = await db.query('SELECT * FROM productos WHERE catalogo_mayorista = 1 LIMIT 2000');
      rows = fallbackRows;
    }

    const catalog = rows.map(p => ({
      ...p,
      precio_ruta: p.precio_ruta !== undefined && p.precio_ruta !== null ? p.precio_ruta : (p.mayorista || p.mayoreo || 0),
      catalogo_mayorista: 1,
      imagen: p.imagen ? (Buffer.isBuffer(p.imagen) ? p.imagen.toString('utf-8') : p.imagen) : null
    }));

    res.json(catalog);
  } catch (error) {
    console.error('Error en getCatalogProducts:', error);
    res.status(500).json({ msg: 'Error al obtener catálogo mayorista.', error: error.message });
  }
};

// Activar o desactivar producto en catálogo con validación de Precio de Ruta
const toggleCatalogStatus = async (req, res) => {
  const { id } = req.params;
  const { catalogo_mayorista } = req.body;

  try {
    // Consulta dinámica para evitar fallas si columnas no existen
    const [prodCols] = await db.query('SHOW COLUMNS FROM productos');
    const prodFields = prodCols.map(c => c.Field);
    const safeFields = ['id_producto', 'nombre', 'codigo', 'costo', 'venta', 'mayoreo', 'precio_ruta', 'mayorista', 'catalogo_mayorista']
      .filter(f => prodFields.includes(f));
    
    const [rows] = await db.query(
      `SELECT ${safeFields.map(f => `\`${f}\``).join(', ')} FROM productos WHERE id_producto = ?`,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ msg: 'Producto no encontrado.' });
    }

    const product = rows[0];
    const newStatus = catalogo_mayorista ? 1 : 0;

    // Validación estricta
    if (newStatus === 1) {
      const routePrice = Number(product.precio_ruta || product.mayorista || product.mayoreo || 0);
      const cost = Number(product.costo || 0);

      if (routePrice <= 0) {
        return res.status(400).json({
          msg: `Para activar "${product.nombre}" en el catálogo mayorista es obligatorio definir un Precio de Ruta mayor a C$ 0.`,
          requires_price_config: true,
          product: {
            id_producto: product.id_producto,
            codigo: product.codigo,
            nombre: product.nombre,
            costo: product.costo || 0,
            venta: product.venta || 0,
            mayoreo: product.mayoreo || 0
          }
        });
      }

      if (routePrice < cost) {
        return res.status(400).json({
          msg: `El Precio de Ruta (C$ ${routePrice.toFixed(2)}) no puede ser menor que el costo (C$ ${cost.toFixed(2)}).`,
          requires_price_config: true,
          product: {
            id_producto: product.id_producto,
            codigo: product.codigo,
            nombre: product.nombre,
            costo: product.costo || 0,
            venta: product.venta || 0,
            mayoreo: product.mayoreo || 0
          }
        });
      }
    }

    await db.query('UPDATE productos SET catalogo_mayorista = ? WHERE id_producto = ?', [newStatus, id]);

    const io = req.app.get('io');
    if (io) {
      io.emit('mayorista_update', { action: 'toggle_catalog', id_producto: id, catalogo_mayorista: newStatus });
    }

    res.json({
      msg: newStatus === 1 ? 'Producto activado en catálogo mayorista.' : 'Producto desactivado del catálogo mayorista.',
      id_producto: id,
      catalogo_mayorista: newStatus
    });
  } catch (error) {
    console.error('Error en toggleCatalogStatus:', error);
    res.status(500).json({ msg: error.message || 'Error al cambiar estado de catálogo.' });
  }
};

// Actualizar configuración mayorista de producto (precio ruta, descuento, promo, combo, catálogo)
const updateMayoristaConfig = async (req, res) => {
  const { id } = req.params;
  const {
    precio_ruta,
    descuento_mayorista,
    promocion_mayorista,
    combo_mayorista,
    catalogo_mayorista,
    imagen
  } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM productos WHERE id_producto = ?', [id]);
    if (!rows.length) {
      return res.status(404).json({ msg: 'Producto no encontrado.' });
    }

    const current = rows[0];
    const cost = Number(current.costo || 0);

    const newRoutePrice = (precio_ruta !== undefined && precio_ruta !== '')
      ? Number(precio_ruta)
      : Number(current.precio_ruta || current.mayorista || 0);

    const newDiscount = (descuento_mayorista !== undefined && descuento_mayorista !== '')
      ? Number(descuento_mayorista)
      : Number(current.descuento_mayorista || 0);

    const newPromo = promocion_mayorista !== undefined ? promocion_mayorista : current.promocion_mayorista;
    const newCombo = combo_mayorista !== undefined ? combo_mayorista : current.combo_mayorista;
    const newInCatalog = catalogo_mayorista !== undefined ? (catalogo_mayorista ? 1 : 0) : current.catalogo_mayorista;

    if (newInCatalog === 1) {
      if (isNaN(newRoutePrice) || newRoutePrice <= 0) {
        return res.status(400).json({ msg: 'Para activar en el catálogo mayorista, el Precio de Ruta debe ser mayor a C$ 0.' });
      }
      if (newRoutePrice < cost) {
        return res.status(400).json({ msg: `El Precio de Ruta (C$ ${newRoutePrice.toFixed(2)}) no puede ser menor al costo (C$ ${cost.toFixed(2)}).` });
      }
    }

    await db.query(
      `UPDATE productos SET 
        precio_ruta = ?,
        mayorista = ?,
        descuento_mayorista = ?,
        promocion_mayorista = ?,
        combo_mayorista = ?,
        catalogo_mayorista = ?
      WHERE id_producto = ?`,
      [
        newRoutePrice,
        newRoutePrice,
        newDiscount,
        newPromo || null,
        newCombo || null,
        newInCatalog,
        id
      ]
    );

    if (imagen !== undefined) {
      await db.query('UPDATE productos SET imagen = ? WHERE id_producto = ?', [imagen || null, id]);
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('mayorista_update', {
        action: 'update_config',
        id_producto: id,
        precio_ruta: newRoutePrice,
        descuento_mayorista: newDiscount,
        promocion_mayorista: newPromo,
        combo_mayorista: newCombo,
        catalogo_mayorista: newInCatalog
      });
      if (imagen !== undefined) {
        io.emit('product_image_updated', { id_producto: id, id });
      }
    }

    res.json({
      msg: 'Configuración mayorista guardada exitosamente.',
      id_producto: id,
      precio_ruta: newRoutePrice,
      descuento_mayorista: newDiscount,
      promocion_mayorista: newPromo,
      combo_mayorista: newCombo,
      catalogo_mayorista: newInCatalog
    });
  } catch (error) {
    console.error('Error en updateMayoristaConfig:', error);
    res.status(500).json({ msg: error.message || 'Error al actualizar configuración mayorista.' });
  }
};

/* =========================================================================
   3. INVENTARIO EN RUTA ("LO QUE LLEVA EL MUCHACHO EN LA RUTA")
========================================================================= */

// Obtener todas las cargas de ruta (activas o históricas)
const getCargasRuta = async (req, res) => {
  try {
    const { estado } = req.query; // 'EN_RUTA' o null
    let query = `
      SELECT 
        c.*,
        e.nombre AS nombre_empleado_db,
        e.telefono AS telefono_rutero
      FROM cargas_ruta c
      LEFT JOIN empleados e ON c.id_empleado = e.id_empleado
    `;
    const params = [];
    if (estado) {
      query += ' WHERE c.estado = ?';
      params.push(estado);
    }
    query += ' ORDER BY c.id_carga DESC';

    const [cargas] = await db.query(query, params);
    res.json(cargas);
  } catch (error) {
    console.error('Error en getCargasRuta:', error);
    res.status(500).json({ msg: 'Error al obtener cargas de ruta.' });
  }
};

// Obtener el detalle de una carga específica (inventario actual del rutero)
const getDetalleCargaRuta = async (req, res) => {
  const { id } = req.params;
  try {
    const [cargas] = await db.query('SELECT * FROM cargas_ruta WHERE id_carga = ?', [id]);
    if (!cargas.length) return res.status(404).json({ msg: 'Carga de ruta no encontrada.' });

    const [items] = await db.query(`
      SELECT 
        d.*,
        p.codigo,
        p.nombre AS nombre_producto,
        p.imagen,
        p.existencia AS existencia_en_tienda,
        (d.cantidad_cargada - d.cantidad_vendida - d.cantidad_devuelta) AS stock_actual_furgon
      FROM cargas_ruta_detalle d
      JOIN productos p ON d.id_producto = p.id_producto
      WHERE d.id_carga = ?
    `, [id]);

    const formattedItems = items.map(it => ({
      ...it,
      imagen: it.imagen ? (Buffer.isBuffer(it.imagen) ? it.imagen.toString('utf-8') : it.imagen) : null
    }));

    res.json({
      carga: cargas[0],
      items: formattedItems
    });
  } catch (error) {
    console.error('Error en getDetalleCargaRuta:', error);
    res.status(500).json({ msg: 'Error al obtener detalle de la carga de ruta.' });
  }
};

// Crear nueva carga de ruta (Despacho de inventario al rutero/muchacho)
const crearCargaRuta = async (req, res) => {
  let {
    id_empleado,
    nombre_rutero,
    vehiculo_ruta,
    zona,
    notas,
    porcentaje_comision = 0,
    items // [ { id_producto, cantidad, precio_ruta } ]
  } = req.body;

  const id_usuario = req.user?.id_usuario || req.user?.id;

  // El rutero DEBE ser un empleado existente
  if (!id_empleado) {
    return res.status(400).json({ msg: 'Debe seleccionar un empleado registrado como rutero. Registre al empleado primero en el módulo de Empleados.' });
  }

  // Verificar que el empleado exista y obtener su nombre
  try {
    const [empRows] = await db.query('SELECT id_empleado, nombre FROM empleados WHERE id_empleado = ?', [id_empleado]);
    if (!empRows.length) {
      return res.status(400).json({ msg: 'El empleado seleccionado no existe. Registre al empleado primero en el módulo de Empleados.' });
    }
    // Siempre usar el nombre real del empleado
    nombre_rutero = empRows[0].nombre;
  } catch (empErr) {
    return res.status(500).json({ msg: 'Error al verificar empleado: ' + empErr.message });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ msg: 'Debe agregar al menos un producto a cargar.' });
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    let totalItems = 0;
    let totalValorRuta = 0;

    // 1. Validar existencias en tienda y descontar
    for (const it of items) {
      const pid = it.id_producto;
      const qty = parseInt(it.cantidad, 10);
      if (qty <= 0) continue;

      const [pRows] = await connection.query(
        'SELECT id_producto, nombre, existencia, costo, COALESCE(precio_ruta, mayorista, venta) AS p_ruta FROM productos WHERE id_producto = ? FOR UPDATE',
        [pid]
      );
      if (!pRows.length) throw new Error(`Producto ID ${pid} no encontrado.`);

      const p = pRows[0];
      if (p.existencia < qty) {
        throw new Error(`Stock insuficiente en tienda para "${p.nombre}". Disponible: ${p.existencia}, Solicitado: ${qty}.`);
      }

      // Descontar de tienda
      await connection.query('UPDATE productos SET existencia = existencia - ? WHERE id_producto = ?', [qty, pid]);

      // Movimiento de inventario
      await connection.query(
        'INSERT INTO movimientos_inventario (id_producto, tipo_movimiento, detalles, id_usuario) VALUES (?, ?, ?, ?)',
        [pid, 'SALIDA_LOTE', `Carga a ruta para: ${nombre_rutero} (${qty} un.)`, id_usuario || null]
      );

      const price = Number(it.precio_ruta || p.p_ruta || 0);
      totalItems += qty;
      totalValorRuta += price * qty;
    }

    // 2. Insertar cabecera de carga con porcentaje de comisión
    const [cargaRes] = await connection.query(`
      INSERT INTO cargas_ruta 
      (id_empleado, nombre_rutero, vehiculo_ruta, zona, total_items, total_valor_ruta, porcentaje_comision, notas, id_usuario_creo, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'EN_RUTA')
    `, [
      id_empleado || null,
      nombre_rutero.trim(),
      vehiculo_ruta || null,
      zona || null,
      totalItems,
      totalValorRuta,
      parseFloat(porcentaje_comision || 0),
      notas || null,
      id_usuario || null
    ]);

    const id_carga = cargaRes.insertId;

    // 3. Insertar detalle
    for (const it of items) {
      const pid = it.id_producto;
      const qty = parseInt(it.cantidad, 10);
      if (qty <= 0) continue;

      const [pRows] = await connection.query(
        'SELECT costo, COALESCE(precio_ruta, mayorista, venta) as p_ruta FROM productos WHERE id_producto = ?',
        [pid]
      );
      const p = pRows[0];
      const routePrice = Number(it.precio_ruta || p.p_ruta || 0);

      await connection.query(`
        INSERT INTO cargas_ruta_detalle 
        (id_carga, id_producto, cantidad_cargada, cantidad_vendida, cantidad_devuelta, precio_ruta_unitario, costo_unitario)
        VALUES (?, ?, ?, 0, 0, ?, ?)
      `, [id_carga, pid, qty, routePrice, Number(p.costo || 0)]);
    }

    await connection.commit();

    const io = req.app.get('io');
    if (io) {
      io.emit('inventory_update', { action: 'carga_ruta_creada', id_carga });
    }

    res.status(201).json({
      msg: `Carga de ruta #${id_carga} creada con éxito. ${totalItems} productos despachados al rutero.`,
      id_carga
    });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error en crearCargaRuta:', error);
    res.status(500).json({ msg: error.message || 'Error al crear la carga de ruta.' });
  } finally {
    if (connection) connection.release();
  }
};

// Liquidar / Devolver sobrantes de una carga de ruta cuando el muchacho regresa
const liquidarCargaRuta = async (req, res) => {
  const { id } = req.params;
  const { devoluciones = [] } = req.body; // [ { id_producto, cantidad_devuelta } ]
  const id_usuario = req.user?.id_usuario || req.user?.id;

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [cRows] = await connection.query('SELECT * FROM cargas_ruta WHERE id_carga = ? FOR UPDATE', [id]);
    if (!cRows.length) throw new Error('Carga no encontrada.');

    const carga = cRows[0];
    if (carga.estado === 'LIQUIDADA') {
      throw new Error('Esta carga ya fue liquidada previamente.');
    }

    // Procesar devoluciones a la tienda
    for (const dev of devoluciones) {
      const pid = dev.id_producto;
      const qtyDev = parseInt(dev.cantidad_devuelta, 10);
      if (qtyDev > 0) {
        // Reintegrar al stock de la tienda
        await connection.query('UPDATE productos SET existencia = existencia + ? WHERE id_producto = ?', [qtyDev, pid]);

        // Registrar devolución en el detalle
        await connection.query(
          'UPDATE cargas_ruta_detalle SET cantidad_devuelta = ? WHERE id_carga = ? AND id_producto = ?',
          [qtyDev, id, pid]
        );

        // Movimiento de inventario
        await connection.query(
          'INSERT INTO movimientos_inventario (id_producto, tipo_movimiento, detalles, id_usuario) VALUES (?, ?, ?, ?)',
          [pid, 'ENTRADA', `Devolución de ruta #${id} (${carga.nombre_rutero}): ${qtyDev} un.`, id_usuario || null]
        );
      }
    }

    // Calcular comisión acumulada del rutero
    const pctComision = Number(carga.porcentaje_comision || 0);
    const montoComision = (Number(carga.total_vendido || 0) * pctComision) / 100;
    const pagada = req.body.comision_pagada !== undefined ? (req.body.comision_pagada ? 1 : 0) : carga.comision_pagada;

    // Marcar carga como liquidada y actualizar monto de comisión
    await connection.query(
      "UPDATE cargas_ruta SET estado = 'LIQUIDADA', fecha_liquidacion = NOW(), monto_comision = ?, comision_pagada = ? WHERE id_carga = ?",
      [montoComision, pagada, id]
    );

    await connection.commit();

    const io = req.app.get('io');
    if (io) {
      io.emit('inventory_update', { action: 'carga_ruta_liquidada', id_carga: id });
    }

    res.json({ msg: `Carga de ruta #${id} liquidada exitosamente. Sobrantes reintegrados al inventario.` });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error en liquidarCargaRuta:', error);
    res.status(500).json({ msg: error.message || 'Error al liquidar la carga de ruta.' });
  } finally {
    if (connection) connection.release();
  }
};

// Actualizar estado de pago de comisión de una carga (PAGADA o PENDIENTE)
const toggleComisionPagada = async (req, res) => {
  const { id } = req.params;
  const { comision_pagada } = req.body;
  try {
    await db.query('UPDATE cargas_ruta SET comision_pagada = ? WHERE id_carga = ?', [comision_pagada ? 1 : 0, id]);
    res.json({
      msg: `Comisión de carga #${id} marcada como ${comision_pagada ? 'PAGADA' : 'PENDIENTE'}.`,
      comision_pagada: Boolean(comision_pagada)
    });
  } catch (error) {
    console.error('Error en toggleComisionPagada:', error);
    res.status(500).json({ msg: 'Error al actualizar estado de la comisión.' });
  }
};

/* =========================================================================
   4. CLIENTES DE RUTA MAYORISTA
========================================================================= */

// Listar clientes de ruta mayorista
const getClientesRuta = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT * FROM clientes 
      WHERE tipo_cliente = 'MAYORISTA_RUTA'
      ORDER BY nombre ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error en getClientesRuta:', error);
    res.status(500).json({ msg: 'Error al obtener clientes de ruta.' });
  }
};

// Crear cliente de ruta mayorista
const crearClienteRuta = async (req, res) => {
  const { nombre, telefono, direccion, zona_ruta, limite_credito } = req.body;

  if (!nombre || !nombre.trim()) {
    return res.status(400).json({ msg: 'El nombre del cliente o taller es obligatorio.' });
  }

  try {
    const [result] = await db.query(`
      INSERT INTO clientes (nombre, telefono, direccion, zona_ruta, limite_credito, tipo_cliente)
      VALUES (?, ?, ?, ?, ?, 'MAYORISTA_RUTA')
    `, [
      nombre.trim(),
      telefono || null,
      direccion || null,
      zona_ruta || null,
      Number(limite_credito || 0)
    ]);

    res.status(201).json({
      id_cliente: result.insertId,
      nombre,
      telefono,
      direccion,
      zona_ruta,
      limite_credito: Number(limite_credito || 0),
      tipo_cliente: 'MAYORISTA_RUTA'
    });
  } catch (error) {
    console.error('Error en crearClienteRuta:', error);
    res.status(500).json({ msg: error.message || 'Error al crear cliente de ruta.' });
  }
};

/* =========================================================================
   5. FACTURACIÓN Y FACTURAS DE RUTA MAYORISTA
========================================================================= */

// Obtener facturas de ruta mayorista
const getFacturasRuta = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        v.id_venta,
        v.numero_factura,
        v.fecha,
        v.total_venta,
        v.subtotal,
        v.descuento,
        v.tipo_pago,
        v.metodo_pago,
        v.estado,
        v.id_cliente,
        v.id_carga,
        c.nombre AS nombre_cliente,
        c.telefono AS telefono_cliente,
        c.zona_ruta,
        u.nombre_usuario AS vendedor,
        cr.nombre_rutero,
        cr.vehiculo_ruta
      FROM ventas v
      LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
      LEFT JOIN usuarios u ON v.id_usuario = u.id_usuario
      LEFT JOIN cargas_ruta cr ON v.id_carga = cr.id_carga
      WHERE v.tipo_venta = 'RUTA_MAYORISTA'
      ORDER BY v.id_venta DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error en getFacturasRuta:', error);
    res.status(500).json({ msg: 'Error al obtener facturas de ruta.' });
  }
};

// Obtener detalle de una factura de ruta mayorista
const getDetalleFacturaRuta = async (req, res) => {
  const { id } = req.params;
  try {
    const [facturaRows] = await db.query(`
      SELECT 
        v.*,
        c.nombre AS nombre_cliente,
        c.telefono AS telefono_cliente,
        c.direccion AS direccion_cliente,
        c.zona_ruta,
        u.nombre_usuario AS vendedor,
        cr.nombre_rutero,
        cr.vehiculo_ruta
      FROM ventas v
      LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
      LEFT JOIN usuarios u ON v.id_usuario = u.id_usuario
      LEFT JOIN cargas_ruta cr ON v.id_carga = cr.id_carga
      WHERE v.id_venta = ?
    `, [id]);

    if (!facturaRows.length) {
      return res.status(404).json({ msg: 'Factura no encontrada.' });
    }

    const [items] = await db.query(`
      SELECT 
        dv.*,
        p.codigo,
        p.nombre AS nombre_producto
      FROM detalle_ventas dv
      JOIN productos p ON dv.id_producto = p.id_producto
      WHERE dv.id_venta = ?
    `, [id]);

    res.json({
      factura: facturaRows[0],
      items
    });
  } catch (error) {
    console.error('Error en getDetalleFacturaRuta:', error);
    res.status(500).json({ msg: 'Error al obtener detalle de la factura de ruta.' });
  }
};

// Crear factura de venta en ruta mayorista
const crearFacturaRuta = async (req, res) => {
  const {
    id_cliente,
    id_carga,
    metodo_pago = 'EFECTIVO', // EFECTIVO, CREDITO, TRANSFERENCIA, MIXTO
    tipo_pago = 'Contado',
    items, // [ { id_producto, cantidad, precio_unitario, descuento } ]
    descuento_general = 0,
    notas
  } = req.body;

  const id_usuario = req.user?.id_usuario || req.user?.id;

  if (!id_cliente) {
    return res.status(400).json({ msg: 'Debe seleccionar un cliente de ruta.' });
  }
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ msg: 'La factura debe contener al menos un producto.' });
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    // 1. Obtener cliente
    const [cliRows] = await connection.query('SELECT * FROM clientes WHERE id_cliente = ?', [id_cliente]);
    if (!cliRows.length) throw new Error('Cliente no encontrado.');
    const cliente = cliRows[0];

    // 2. Validar totales e inventario (descontar de la carga o de tienda)
    let subtotal = 0;
    let totalDescuentoItems = 0;

    for (const it of items) {
      const pid = it.id_producto;
      const qty = parseInt(it.cantidad, 10);
      const unit = parseFloat(it.precio_unitario);
      const descItem = parseFloat(it.descuento || 0);

      if (qty <= 0 || isNaN(unit) || unit <= 0) {
        throw new Error('Cantidad y precio unitario deben ser válidos.');
      }

      // Si está asociada a una carga de ruta, verificar y actualizar el stock del furgón
      if (id_carga) {
        const [detCarga] = await connection.query(
          'SELECT cantidad_cargada, cantidad_vendida, cantidad_devuelta FROM cargas_ruta_detalle WHERE id_carga = ? AND id_producto = ?',
          [id_carga, pid]
        );
        if (detCarga.length > 0) {
          const disponibleRuta = detCarga[0].cantidad_cargada - detCarga[0].cantidad_vendida - detCarga[0].cantidad_devuelta;
          if (disponibleRuta < qty) {
            throw new Error(`Stock insuficiente en la ruta para el producto ID ${pid}. En furgón: ${disponibleRuta}, Solicitado: ${qty}.`);
          }
          await connection.query(
            'UPDATE cargas_ruta_detalle SET cantidad_vendida = cantidad_vendida + ? WHERE id_carga = ? AND id_producto = ?',
            [qty, id_carga, pid]
          );
        }
      } else {
        // Descontar directo de tienda si no se especificó carga de ruta
        const [pRows] = await connection.query('SELECT existencia, nombre FROM productos WHERE id_producto = ? FOR UPDATE', [pid]);
        if (pRows[0].existencia < qty) {
          throw new Error(`Stock insuficiente en tienda para "${pRows[0].nombre}". Disponible: ${pRows[0].existencia}.`);
        }
        await connection.query('UPDATE productos SET existencia = existencia - ? WHERE id_producto = ?', [qty, pid]);
      }

      subtotal += unit * qty;
      totalDescuentoItems += descItem;
    }

    const totalDescuento = totalDescuentoItems + parseFloat(descuento_general || 0);
    const totalVenta = Math.max(0, subtotal - totalDescuento);

    // Si es a crédito, verificar límite
    if (metodo_pago === 'CREDITO' || tipo_pago === 'Crédito') {
      const nuevoSaldo = Number(cliente.saldo_pendiente || 0) + totalVenta;
      const limite = Number(cliente.limite_credito || 0);
      if (limite > 0 && nuevoSaldo > limite) {
        throw new Error(`El crédito excede el límite del cliente (Límite: C$ ${limite.toFixed(2)}, Saldo actual: C$ ${cliente.saldo_pendiente || 0}).`);
      }
      await connection.query(
        'UPDATE clientes SET saldo_pendiente = saldo_pendiente + ? WHERE id_cliente = ?',
        [totalVenta, id_cliente]
      );
    }

    // Número de factura de ruta
    const numFactura = `RM-${Date.now().toString().slice(-6)}`;

    // 3. Insertar venta
    const [vRes] = await connection.query(`
      INSERT INTO ventas 
      (total_venta, subtotal, descuento, tipo_pago, metodo_pago, id_usuario, id_cliente, estado, tipo_venta, numero_factura, id_carga)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'COMPLETADA', 'RUTA_MAYORISTA', ?, ?)
    `, [
      totalVenta,
      subtotal,
      totalDescuento,
      tipo_pago,
      metodo_pago,
      id_usuario || null,
      id_cliente,
      numFactura,
      id_carga || null
    ]);

    const id_venta = vRes.insertId;

    // 4. Insertar detalle_ventas
    for (const it of items) {
      await connection.query(`
        INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario)
        VALUES (?, ?, ?, ?)
      `, [id_venta, it.id_producto, it.cantidad, it.precio_unitario]);
    }

    // Si había carga de ruta, actualizar total_vendido y comisión generada de la carga
    if (id_carga) {
      const [cRows] = await connection.query('SELECT porcentaje_comision FROM cargas_ruta WHERE id_carga = ?', [id_carga]);
      const pct = Number(cRows[0]?.porcentaje_comision || 0);
      const comisionVenta = (totalVenta * pct) / 100;

      await connection.query(
        'UPDATE cargas_ruta SET total_vendido = total_vendido + ?, total_recaudado = total_recaudado + ?, monto_comision = monto_comision + ? WHERE id_carga = ?',
        [totalVenta, metodo_pago === 'EFECTIVO' ? totalVenta : 0, comisionVenta, id_carga]
      );
    }

    await connection.commit();

    const io = req.app.get('io');
    if (io) {
      io.emit('sales_update', { action: 'venta_ruta_creada', id_venta });
      io.emit('inventory_update', { action: 'venta_ruta_stock' });
    }

    res.status(201).json({
      msg: 'Factura de ruta mayorista creada con éxito.',
      id_venta,
      numero_factura: numFactura,
      total_venta: totalVenta
    });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error en crearFacturaRuta:', error);
    res.status(500).json({ msg: error.message || 'Error al emitir factura de ruta mayorista.' });
  } finally {
    if (connection) connection.release();
  }
};

/* =========================================================================
   6. MÉTRICAS Y ESTADÍSTICAS DEL SISTEMA MAYORISTA (DASHBOARD INDEPENDIENTE)
========================================================================= */
const getMayoristaMetrics = async (req, res) => {
  try {
    // Check if ventas has tipo_venta column
    let hasVentasTipo = false;
    try {
      const [ventasCols] = await db.query('SHOW COLUMNS FROM ventas');
      hasVentasTipo = ventasCols.some(c => c.Field === 'tipo_venta');
    } catch(e) {}

    // 1. Resumen de Ventas de Ruta
    let salesSummary = [{}];
    if (hasVentasTipo) {
      try {
        [salesSummary] = await db.query(`
          SELECT 
            COUNT(*) AS total_facturas,
            COALESCE(SUM(total_venta), 0) AS total_ventas,
            COALESCE(SUM(subtotal), 0) AS subtotal,
            COALESCE(SUM(descuento), 0) AS total_descuentos
          FROM ventas 
          WHERE tipo_venta = 'RUTA_MAYORISTA'
        `);
      } catch(e) { console.warn('Metrics: ventas query error:', e.message); }
    }

    // 2. Margen y Ganancia de Ruta
    let profitSummary = [{}];
    if (hasVentasTipo) {
      try {
        [profitSummary] = await db.query(`
          SELECT 
            COALESCE(SUM(dv.cantidad * dv.precio_unitario), 0) AS venta_bruta,
            COALESCE(SUM(dv.cantidad * p.costo), 0) AS costo_total,
            COALESCE(SUM(dv.cantidad * (dv.precio_unitario - p.costo)), 0) AS ganancia_neta
          FROM detalle_ventas dv
          JOIN ventas v ON dv.id_venta = v.id_venta
          JOIN productos p ON dv.id_producto = p.id_producto
          WHERE v.tipo_venta = 'RUTA_MAYORISTA'
        `);
      } catch(e) { console.warn('Metrics: profit query error:', e.message); }
    }

    // 3. Mercancía actualmente en calle / furgones (cargas activas)
    let cargasSummary = [{}];
    try {
      [cargasSummary] = await db.query(`
        SELECT 
          COUNT(*) AS cargas_activas,
          COALESCE(SUM(total_valor_ruta - total_vendido), 0) AS valor_en_ruta,
          COALESCE(SUM(total_items), 0) AS items_cargados,
          COALESCE(SUM(total_vendido), 0) AS total_vendido_cargas,
          COALESCE(SUM(total_recaudado), 0) AS total_recaudado_cargas
        FROM cargas_ruta 
        WHERE estado = 'EN_RUTA'
      `);
    } catch(e) { console.warn('Metrics: cargas query error:', e.message); }

    // 4. Cartera de Clientes de Ruta (Cuentas por cobrar)
    let clientsSummary = [{}];
    try {
      const [clientCols] = await db.query('SHOW COLUMNS FROM clientes');
      const clientFields = clientCols.map(c => c.Field);
      const hasSaldo = clientFields.includes('saldo_pendiente');
      const hasLimite = clientFields.includes('limite_credito');
      const hasTipo = clientFields.includes('tipo_cliente');

      if (hasTipo) {
        [clientsSummary] = await db.query(`
          SELECT 
            COUNT(*) AS total_clientes_ruta,
            ${hasSaldo ? "COALESCE(SUM(saldo_pendiente), 0)" : "0"} AS saldo_por_cobrar,
            ${hasLimite ? "COALESCE(SUM(limite_credito), 0)" : "0"} AS limite_total_credito
          FROM clientes 
          WHERE tipo_cliente = 'MAYORISTA_RUTA'
        `);
      }
    } catch(e) { console.warn('Metrics: clientes query error:', e.message); }

    // 5. Rendimiento por Rutero con Comisiones
    let ruterosRanking = [];
    try {
      [ruterosRanking] = await db.query(`
        SELECT 
          nombre_rutero,
          COUNT(*) AS total_viajes,
          COALESCE(SUM(total_valor_ruta), 0) AS total_cargado,
          COALESCE(SUM(total_vendido), 0) AS total_vendido,
          COALESCE(SUM(total_recaudado), 0) AS total_recaudado,
          COALESCE(SUM(monto_comision), 0) AS total_comisiones,
          COALESCE(SUM(CASE WHEN comision_pagada = 1 THEN monto_comision ELSE 0 END), 0) AS comisiones_pagadas,
          COALESCE(SUM(CASE WHEN comision_pagada = 0 THEN monto_comision ELSE 0 END), 0) AS comisiones_pendientes
        FROM cargas_ruta
        GROUP BY nombre_rutero
        ORDER BY total_vendido DESC
        LIMIT 10
      `);
    } catch(e) { console.warn('Metrics: ruteros query error:', e.message); }

    // 6. Top 10 Productos Más Vendidos en Ruta
    let topProducts = [];
    if (hasVentasTipo) {
      try {
        [topProducts] = await db.query(`
          SELECT 
            p.id_producto,
            p.codigo,
            p.nombre,
            SUM(dv.cantidad) AS total_unidades,
            SUM(dv.cantidad * dv.precio_unitario) AS total_ingresos
          FROM detalle_ventas dv
          JOIN ventas v ON dv.id_venta = v.id_venta
          JOIN productos p ON dv.id_producto = p.id_producto
          WHERE v.tipo_venta = 'RUTA_MAYORISTA'
          GROUP BY p.id_producto, p.codigo, p.nombre
          ORDER BY total_unidades DESC
          LIMIT 10
        `);
      } catch(e) { console.warn('Metrics: top products query error:', e.message); }
    }

    res.json({
      ventas: salesSummary[0] || {},
      finanzas: profitSummary[0] || {},
      inventario_ruta: cargasSummary[0] || {},
      cartera_clientes: clientsSummary[0] || {},
      ranking_ruteros: ruterosRanking || [],
      top_productos: topProducts || []
    });
  } catch (error) {
    console.error('Error en getMayoristaMetrics:', error);
    res.status(500).json({ msg: 'Error al obtener métricas del sistema mayorista.' });
  }
};

module.exports = {
  initMayoristaModule,
  getAllMayoristaProducts,
  getCatalogProducts,
  toggleCatalogStatus,
  updateMayoristaConfig,
  getCargasRuta,
  getDetalleCargaRuta,
  crearCargaRuta,
  liquidarCargaRuta,
  toggleComisionPagada,
  getClientesRuta,
  crearClienteRuta,
  getFacturasRuta,
  getDetalleFacturaRuta,
  crearFacturaRuta,
  getMayoristaMetrics
};

