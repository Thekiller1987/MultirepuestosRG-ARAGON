/**
 * @file productController.js
 * @description Controladores para la lógica de negocio de los productos.
 * @version 2.2.2 (BD alineada + DELETE con FKs SET NULL)
 */

const db = require('../config/db.js');

/* ===================== CREATE ===================== */
const createProduct = async (req, res) => {
  const {
    codigo, nombre, costo, venta, existencia,
    minimo, maximo, id_categoria, id_proveedor,
    tipo_venta, mayoreo, imagen, descripcion,
    precio_ruta, descuento_mayorista, promocion_mayorista, combo_mayorista, catalogo_mayorista
  } = req.body;

  console.log('CREATE PRODUCT REQUEST:', { codigo, nombre, imagenLength: imagen ? imagen.length : 'NULL' });

  const id_usuario = req.user?.id_usuario || req.user?.id;

  if (!codigo || !nombre || costo === undefined || venta === undefined || existencia === undefined) {
    return res.status(400).json({ msg: 'Campos obligatorios: código, nombre, costo, venta y existencia.' });
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    // No duplicados por código o nombre
    const [exist] = await connection.query(
      'SELECT id_producto FROM productos WHERE codigo = ? OR nombre = ?',
      [codigo, nombre]
    );
    if (exist.length > 0) throw new Error('Ya existe un producto con este código o nombre.');

    const productData = {
      codigo, nombre, costo, venta, existencia,
      minimo, maximo, id_categoria, id_proveedor,
      tipo_venta, mayoreo, imagen, descripcion,
      precio_ruta: precio_ruta || mayoreo || null,
      descuento_mayorista: descuento_mayorista || 0,
      promocion_mayorista: promocion_mayorista || null,
      combo_mayorista: combo_mayorista || null,
      catalogo_mayorista: catalogo_mayorista ? 1 : 0
    };

    // Filtrar sólo columnas existentes para evitar errores SQL
    const [tableCols] = await connection.query('SHOW COLUMNS FROM productos');
    const existingColNames = new Set(tableCols.map(c => c.Field));
    const safeProductData = {};
    for (const [key, val] of Object.entries(productData)) {
      if (existingColNames.has(key)) {
        safeProductData[key] = val;
      }
    }

    const [result] = await connection.query('INSERT INTO productos SET ?', [safeProductData]);
    const id_producto = result.insertId;

    // Movimiento inventario
    await connection.query(
      'INSERT INTO movimientos_inventario (id_producto, tipo_movimiento, detalles, id_usuario) VALUES (?, ?, ?, ?)',
      [id_producto, 'CREACION', `Producto creado con existencia inicial de ${existencia}`, id_usuario || null]
    );

    await connection.commit();

    // SOCKET EMIT
    const io = req.app.get('io');
    if (io) {
      io.emit('inventory_update', { action: 'create', id: id_producto });
    }

    res.status(201).json({ id: id_producto, ...productData });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error en createProduct:', error);
    res.status(500).json({ msg: error.message || 'Error al crear el producto.' });
  } finally {
    if (connection) connection.release();
  }
};


let cachedSelectFields = null;

const getProductColumnsSafe = async () => {
  if (cachedSelectFields) return cachedSelectFields;
  try {
    const [cols] = await db.query('SHOW COLUMNS FROM productos');
    const validCols = cols
      .map(c => c.Field)
      .filter(f => f !== 'imagen')
      .map(f => `p.\`${f}\``);
    if (validCols.length > 0) {
      cachedSelectFields = validCols.join(', ');
      return cachedSelectFields;
    }
  } catch (err) {
    console.warn('[getAllProducts] Fallback selecting p.*:', err.message);
  }
  return 'p.*';
};

/* ===================== READ ===================== */
const getAllProducts = async (_req, res) => {
  try {
    // PERF: Excluimos imagen del listado masivo para que 4000+ productos carguen instantáneamente.
    // Las imágenes se sirven bajo demanda por /api/products/:id/image y se cachean con lazy image.
    const selectFields = await getProductColumnsSafe();
    const query = `
      SELECT ${selectFields},
             c.nombre AS nombre_categoria, pr.nombre AS nombre_proveedor
      FROM productos p
      LEFT JOIN categorias c   ON p.id_categoria  = c.id_categoria
      LEFT JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
      ORDER BY p.nombre ASC
    `;
    const [rows] = await db.query(query);

    // 1. Obtener carritos activos de forma segura (sin que un fallo en active_carts tumbe los productos)
    let carts = [];
    try {
      const requestingUserId = _req.user?.id_usuario || _req.user?.id;
      const [cartRows] = await db.query(
        "SELECT user_id, carts_json FROM active_carts WHERE updated_at > NOW() - INTERVAL 60 MINUTE AND user_id != ?",
        [requestingUserId || -1]
      );
      carts = cartRows || [];
    } catch (e) {
      // Ignorar si la tabla no existe o error en active_carts
    }

    // 2. Calcular stock reservado por producto
    const reservedMap = new Map();
    carts.forEach(c => {
      try {
        let items = c.carts_json;
        if (typeof items === 'string') {
          items = JSON.parse(items);
        }
        if (!items) items = [];

        if (Array.isArray(items)) {
          items.forEach(ticket => {
            if (ticket.items && Array.isArray(ticket.items)) {
              ticket.items.forEach(item => {
                const pid = item.id_producto || item.id;
                const qty = Number(item.quantity || item.cantidad || 0);
                reservedMap.set(pid, (reservedMap.get(pid) || 0) + qty);
              });
            }
          });
        }
      } catch (e) { /* ignore parse error */ }
    });

    // 3. Formatear y restar stock reservado
    const products = rows.map(p => {
      const pid = p.id_producto;
      const reserved = reservedMap.get(pid) || 0;
      const existenciaReal = Math.max(0, p.existencia - reserved);

      return {
        ...p,
        existencia: existenciaReal, // Override existence with Available Stock
        reserved: reserved,         // Optional: expose reserved count
        imagen: null,               // Carga perezosa ultra rápida
        precio_ruta: p.precio_ruta !== undefined ? p.precio_ruta : (p.mayoreo || 0),
        catalogo_mayorista: p.catalogo_mayorista !== undefined ? p.catalogo_mayorista : 0
      };
    });

    res.json(products);
  } catch (error) {
    console.error('Error en getAllProducts:', error);
    res.status(500).json({ msg: 'Error al obtener productos.', error: error.message });
  }
};

/* ===================== GET IMAGE BY ID (LAZY IMAGE) ===================== */
const getProductImage = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      'SELECT imagen FROM productos WHERE id_producto = ?',
      [id]
    );
    if (!rows.length) {
      return res.status(404).json({ msg: 'Producto no encontrado.' });
    }

    const raw = rows[0].imagen;
    const imagen = raw
      ? (Buffer.isBuffer(raw) ? raw.toString('utf-8') : raw)
      : null;

    res.json({ imagen });
  } catch (error) {
    console.error(`[IMAGE_REQUEST] Error al obtener imagen para ID ${id}:`, error);
    res.status(500).json({ msg: 'Error al obtener imagen.' });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT p.*, c.nombre AS nombre_categoria, pr.nombre AS nombre_proveedor
         FROM productos p
         LEFT JOIN categorias  c  ON p.id_categoria  = c.id_categoria
         LEFT JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
       WHERE p.id_producto = ?`,
      [id]
    );
    if (!rows.length) return res.status(404).json({ msg: 'Producto no encontrado.' });

    const p = rows[0];
    const product = {
      ...p,
      imagen: p.imagen ? (Buffer.isBuffer(p.imagen) ? p.imagen.toString('utf-8') : p.imagen) : null
    };

    res.json(product);
  } catch (error) {
    console.error('Error en getProductById:', error);
    res.status(500).json({ msg: 'Error al obtener el producto.' });
  }
};


/* ===================== UPDATE ===================== */
// En tu archivo: productController.js

// En tu productController.js

const updateProduct = async (req, res) => {
  const { id } = req.params;
  console.log("🔥🔥🔥 ¡SÍ ESTOY USANDO EL CÓDIGO NUEVO PARA EDITAR! 🔥🔥🔥");




  // ✅ CAMBIO 1: Ya no se extrae 'existencia' del body.
  const {
    codigo, nombre, costo, venta,
    minimo, maximo, id_categoria, id_proveedor,
    tipo_venta, mayoreo, descripcion, imagen,
    precio_ruta, descuento_mayorista, promocion_mayorista, combo_mayorista, catalogo_mayorista
  } = req.body;

  console.log('UPDATE PRODUCT REQUEST:', { id, codigo, nombre, imagenLength: imagen ? imagen.length : 'NULL' });

  const id_usuario = req.user?.id_usuario || req.user?.id;

  // ✅ CAMBIO 2: Se elimina 'existencia' de la validación.
  if (!codigo || !nombre || costo === undefined || venta === undefined) {
    return res.status(400).json({ msg: 'Campos obligatorios: código, nombre, costo y venta.' });
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    // Primero, asegura que el producto exista
    const [producto] = await connection.query('SELECT existencia FROM productos WHERE id_producto = ?', [id]);
    if (!producto.length) {
      throw new Error('Producto no encontrado.');
    }

    // Luego, revisa duplicados (excluyendo el producto actual)
    const [exist] = await connection.query(
      'SELECT id_producto FROM productos WHERE (codigo = ? OR nombre = ?) AND id_producto != ?',
      [codigo, nombre, id]
    );
    if (exist.length > 0) {
      throw new Error('Ya existe otro producto con este código o nombre.');
    }

    // ✅ CAMBIO 3: El objeto a actualizar ya no incluye 'existencia'.
    const productData = {
      codigo, nombre, costo, venta,
      minimo, maximo, id_categoria, id_proveedor,
      tipo_venta, mayoreo, descripcion, imagen,
      precio_ruta: precio_ruta !== undefined ? (precio_ruta || null) : undefined,
      descuento_mayorista: descuento_mayorista !== undefined ? (descuento_mayorista || 0) : undefined,
      promocion_mayorista: promocion_mayorista !== undefined ? (promocion_mayorista || null) : undefined,
      combo_mayorista: combo_mayorista !== undefined ? (combo_mayorista || null) : undefined,
      catalogo_mayorista: catalogo_mayorista !== undefined ? (catalogo_mayorista ? 1 : 0) : undefined
    };
    // Filtrar sólo columnas existentes en la tabla
    const [tableCols] = await connection.query('SHOW COLUMNS FROM productos');
    const existingColNames = new Set(tableCols.map(c => c.Field));
    const safeProductData = {};
    for (const [key, val] of Object.entries(productData)) {
      if (existingColNames.has(key)) {
        safeProductData[key] = val;
      }
    }

    // Actualiza el producto en la base de datos
    await connection.query('UPDATE productos SET ? WHERE id_producto = ?', [safeProductData, id]);
    cachedSelectFields = null; // Invalidate cache

    // Registra el movimiento de auditoría
    await connection.query(
      'INSERT INTO movimientos_inventario (id_producto, tipo_movimiento, detalles, id_usuario) VALUES (?, ?, ?, ?)',
      [id, 'EDICION', 'Detalles del producto actualizados.', id_usuario || null]
    );

    await connection.commit();

    // SOCKET EMIT
    const io = req.app.get('io');
    if (io) {
      io.emit('inventory_update', { action: 'update', id });
    }

    // Devuelve el objeto actualizado pero con la existencia que ya estaba en la BD.
    res.json({ id, ...productData, existencia: producto[0].existencia });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error en updateProduct:', error);
    res.status(500).json({ msg: error.message || 'Error al actualizar el producto.' });
  } finally {
    if (connection) connection.release();
  }
};


/* ===================== DELETE (con FKs ON DELETE SET NULL) ===================== */
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const id_usuario = req.user?.id_usuario || req.user?.id;

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [rows] = await connection.query('SELECT nombre FROM productos WHERE id_producto = ?', [id]);
    if (!rows.length) {
      await connection.rollback();
      return res.status(404).json({ msg: 'Producto no encontrado.' });
    }

    const nombreProd = rows[0].nombre;

    // 1) Registrar el movimiento ANTES del DELETE
    await connection.query(
      'INSERT INTO movimientos_inventario (id_producto, tipo_movimiento, detalles, id_usuario) VALUES (?, ?, ?, ?)',
      [id, 'ELIMINACION', `Producto "${nombreProd}" eliminado.`, id_usuario || null]
    );

    // 2) Borrar el producto (las FKs lo pondrán en NULL donde aplique)
    await connection.query('DELETE FROM productos WHERE id_producto = ?', [id]);

    await connection.commit();
    res.json({ msg: 'Producto eliminado correctamente.' });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error en deleteProduct:', error);
    res.status(500).json({ msg: error.message || 'Error interno al eliminar el producto.' });
  } finally {
    if (connection) connection.release();
  }
};


/* ===================== ARCHIVE (opcional) ===================== */
/**
 * Tu tabla `productos` NO tiene columna `activo`.
 * Se mantiene la respuesta segura para no romper nada si alguien llama esta ruta.
 */
const archiveProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const [exists] = await db.query('SELECT id_producto, nombre FROM productos WHERE id_producto=?', [id]);
    if (!exists.length) return res.status(404).json({ msg: 'Producto no encontrado.' });

    return res.status(400).json({
      msg: 'Función no disponible: la tabla productos no tiene columna "activo".',
      hint: 'Si deseas archivar, agrega la columna: ALTER TABLE productos ADD COLUMN activo TINYINT(1) NOT NULL DEFAULT 1;'
    });
  } catch (error) {
    console.error('Error en archiveProduct:', error);
    res.status(500).json({ msg: 'No se pudo procesar el archivado.' });
  }
};


/* ===================== AJUSTE DE STOCK ===================== */
const adjustStock = async (req, res) => {
  const { id } = req.params;
  const { cantidad, razon } = req.body;
  const id_usuario = req.user?.id_usuario || req.user?.id;

  const cantidadNum = parseInt(cantidad, 10);
  if (isNaN(cantidadNum) || !Number.isFinite(cantidadNum)) {
    return res.status(400).json({ msg: 'La cantidad debe ser un número válido.' });
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [rows] = await connection.query(
      'SELECT existencia FROM productos WHERE id_producto = ? FOR UPDATE',
      [id]
    );
    if (!rows.length) throw new Error('Producto no encontrado.');

    const oldStock = Number(rows[0].existencia);
    const newStock = oldStock + cantidadNum;

    await connection.query(
      'UPDATE productos SET existencia = ? WHERE id_producto = ?',
      [newStock, id]
    );

    const detalles = `Ajuste: ${cantidadNum > 0 ? '+' : ''}${cantidadNum}. Razón: ${razon || 'No especificada'}. Stock ${oldStock} → ${newStock}.`;

    await connection.query(
      'INSERT INTO movimientos_inventario (id_producto, tipo_movimiento, detalles, id_usuario) VALUES (?, ?, ?, ?)',
      [id, 'AJUSTE_STOCK', detalles, id_usuario || null]
    );

    await connection.commit();

    // SOCKET EMIT
    const io = req.app.get('io');
    if (io) {
      io.emit('inventory_update', { action: 'adjust', id });
      io.emit('products:update', { action: 'adjust', id }); // Redundancy for safety
    }

    res.json({ msg: 'Stock ajustado correctamente.', newStock });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error en adjustStock:', error);
    res.status(500).json({ msg: error.message || 'Error al ajustar stock.' });
  } finally {
    if (connection) connection.release();
  }
};


/* ===================== HISTORIAL ===================== */
const getInventoryHistory = async (_req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT mi.id_movimiento,
             mi.fecha,
             mi.tipo_movimiento,
             mi.detalles,
             p.nombre         AS nombre_producto,
             p.codigo         AS codigo_producto,
             u.nombre_usuario AS nombre_usuario
        FROM movimientos_inventario mi
        LEFT JOIN productos p ON mi.id_producto = p.id_producto
        LEFT JOIN usuarios  u ON mi.id_usuario  = u.id_usuario
       ORDER BY mi.fecha DESC
       LIMIT 100
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error en getInventoryHistory:', error);
    res.status(500).json({ msg: 'Error al obtener historial.' });
  }
};


module.exports = {
  createProduct,
  getAllProducts,
  getProductImage,
  getProductById,
  updateProduct,
  deleteProduct,   // ← ahora permite eliminar aunque haya ventas/pedidos (Fks SET NULL)
  adjustStock,
  getInventoryHistory,
  archiveProduct
};