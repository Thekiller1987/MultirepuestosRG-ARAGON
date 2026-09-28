/**
 * @file migrateAll.js
 * @description Migrador universal de base de datos para Multirepuestos RG.
 * Es completamente idempotente: verifica y crea tablas, columnas, índices
 * y valores iniciales si no existen. Se ejecuta automáticamente al arrancar
 * el servidor (server.js) o manualmente mediante 'npm run migrate'.
 */

const bcrypt = require('bcryptjs');

const runAllMigrations = async (pool) => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🚀 [DB AUTO-MIGRATOR] Iniciando verificación y migración integral...');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Helper para verificar si una columna existe en una tabla
  const hasColumn = async (tableName, columnName) => {
    try {
      const [rows] = await pool.query(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
        [tableName, columnName]
      );
      return rows.length > 0;
    } catch (e) {
      return false;
    }
  };

  // Helper para agregar columna de forma segura
  const addColumnSafe = async (tableName, columnName, columnDefinition) => {
    try {
      const exists = await hasColumn(tableName, columnName);
      if (!exists) {
        await pool.query(`ALTER TABLE \`${tableName}\` ADD COLUMN \`${columnName}\` ${columnDefinition}`);
        console.log(`  ➕ [${tableName}] Columna agregada: ${columnName}`);
      }
    } catch (e) {
      console.warn(`  ⚠️ [${tableName}] Nota en columna ${columnName}:`, e.message);
    }
  };

  try {
    // ─────────────────────────────────────────────────────────────────
    // 1. TABLA: usuarios
    // ─────────────────────────────────────────────────────────────────
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id_usuario INT AUTO_INCREMENT PRIMARY KEY,
        nombre_usuario VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        rol ENUM('Administrador','Vendedor','Contador') NOT NULL DEFAULT 'Administrador'
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // Sembrar usuario inicial si la tabla está vacía
    const [users] = await pool.query('SELECT COUNT(*) AS total FROM usuarios');
    if (users[0].total === 0) {
      const defaultPass = await bcrypt.hash('1987', 10);
      await pool.query(
        'INSERT IGNORE INTO usuarios (nombre_usuario, password, rol) VALUES (?, ?, ?)',
        ['waskar', defaultPass, 'Administrador']
      );
      console.log('  👤 Usuario administrador inicial creado: waskar');
    }

    // ─────────────────────────────────────────────────────────────────
    // 2. TABLAS BÁSICAS: categorias y proveedores
    // ─────────────────────────────────────────────────────────────────
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categorias (
        id_categoria INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL UNIQUE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS proveedores (
        id_proveedor INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(150) NOT NULL UNIQUE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // ─────────────────────────────────────────────────────────────────
    // 3. TABLA: productos
    // ─────────────────────────────────────────────────────────────────
    await pool.query(`
      CREATE TABLE IF NOT EXISTS productos (
        id_producto INT AUTO_INCREMENT PRIMARY KEY,
        codigo VARCHAR(50) NULL UNIQUE,
        nombre VARCHAR(255) NOT NULL,
        costo DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        venta DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        mayoreo DECIMAL(10,2) NULL DEFAULT 0.00,
        existencia INT NOT NULL DEFAULT 0,
        stock_reservado INT NOT NULL DEFAULT 0,
        minimo INT NULL DEFAULT 0,
        maximo INT NULL DEFAULT 0,
        descripcion VARCHAR(255) NULL,
        tipo_venta VARCHAR(50) NULL,
        id_categoria INT NULL,
        id_proveedor INT NULL,
        imagen LONGTEXT NULL,
        activo TINYINT(1) NOT NULL DEFAULT 1,
        catalogo_mayorista TINYINT(1) NOT NULL DEFAULT 0,
        precio_ruta DECIMAL(10,2) NULL DEFAULT 0.00,
        descuento_mayorista DECIMAL(5,2) NULL DEFAULT 0.00,
        promocion_mayorista VARCHAR(255) NULL,
        combo_mayorista VARCHAR(255) NULL,
        INDEX idx_prod_codigo (codigo),
        INDEX idx_prod_nombre (nombre),
        INDEX idx_prod_cat_may (catalogo_mayorista),
        INDEX idx_prod_activo (activo)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // Asegurar todas las columnas en productos existentes
    await addColumnSafe('productos', 'activo', 'TINYINT(1) NOT NULL DEFAULT 1');
    await addColumnSafe('productos', 'stock_reservado', 'INT NOT NULL DEFAULT 0');
    await addColumnSafe('productos', 'catalogo_mayorista', 'TINYINT(1) NOT NULL DEFAULT 0');
    await addColumnSafe('productos', 'precio_ruta', 'DECIMAL(10,2) NULL DEFAULT 0.00');
    await addColumnSafe('productos', 'descuento_mayorista', 'DECIMAL(5,2) NULL DEFAULT 0.00');
    await addColumnSafe('productos', 'promocion_mayorista', 'VARCHAR(255) NULL');
    await addColumnSafe('productos', 'combo_mayorista', 'VARCHAR(255) NULL');
    await addColumnSafe('productos', 'imagen', 'LONGTEXT NULL');

    // Asegurar que imagen sea LONGTEXT si era de tamaño menor
    try {
      const [imgCol] = await pool.query(
        `SELECT DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS 
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'productos' AND COLUMN_NAME = 'imagen'`
      );
      if (imgCol.length > 0 && imgCol[0].DATA_TYPE !== 'longtext') {
        await pool.query('ALTER TABLE productos MODIFY COLUMN imagen LONGTEXT NULL');
        console.log('  🖼️ [productos] Columna imagen actualizada a LONGTEXT');
      }
    } catch (e) {}

    // Backfill inicial para precio_ruta si mayoreo existe
    try {
      await pool.query(
        'UPDATE productos SET precio_ruta = mayoreo WHERE mayoreo > 0 AND (precio_ruta IS NULL OR precio_ruta = 0)'
      );
    } catch (e) {}

    // ─────────────────────────────────────────────────────────────────
    // 4. TABLA: clientes
    // ─────────────────────────────────────────────────────────────────
    await pool.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        id_cliente INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        telefono VARCHAR(20) NULL,
        direccion TEXT NULL,
        limite_credito DECIMAL(10,2) NULL DEFAULT 0.00,
        fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        saldo_pendiente DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        tipo_cliente VARCHAR(50) NOT NULL DEFAULT 'GENERAL',
        zona_ruta VARCHAR(150) NULL,
        INDEX idx_cli_tipo (tipo_cliente),
        INDEX idx_cli_nombre (nombre)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    await addColumnSafe('clientes', 'tipo_cliente', "VARCHAR(50) NOT NULL DEFAULT 'GENERAL'");
    await addColumnSafe('clientes', 'zona_ruta', 'VARCHAR(150) NULL');
    await addColumnSafe('clientes', 'saldo_pendiente', 'DECIMAL(10,2) NOT NULL DEFAULT 0.00');
    await addColumnSafe('clientes', 'limite_credito', 'DECIMAL(10,2) NULL DEFAULT 0.00');

    // ─────────────────────────────────────────────────────────────────
    // 5. TABLA: empleados (Trabajadores / Ruteros)
    // ─────────────────────────────────────────────────────────────────
    await pool.query(`
      CREATE TABLE IF NOT EXISTS empleados (
        id_empleado INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(150) NOT NULL,
        telefono VARCHAR(20) DEFAULT NULL,
        cargo VARCHAR(100) DEFAULT NULL,
        activo TINYINT(1) NOT NULL DEFAULT 1,
        fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_emp_activo (activo),
        INDEX idx_emp_nombre (nombre)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // ─────────────────────────────────────────────────────────────────
    // 6. TABLAS: cargas_ruta y cargas_ruta_detalle (Módulo Rutero)
    // ─────────────────────────────────────────────────────────────────
    await pool.query(`
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
        INDEX idx_carga_estado (estado),
        INDEX idx_carga_empleado (id_empleado)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    await addColumnSafe('cargas_ruta', 'id_empleado', 'INT NULL');
    await addColumnSafe('cargas_ruta', 'porcentaje_comision', 'DECIMAL(5,2) NOT NULL DEFAULT 0.00');
    await addColumnSafe('cargas_ruta', 'monto_comision', 'DECIMAL(10,2) NOT NULL DEFAULT 0.00');
    await addColumnSafe('cargas_ruta', 'comision_pagada', 'TINYINT(1) NOT NULL DEFAULT 0');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS cargas_ruta_detalle (
        id_detalle_carga INT AUTO_INCREMENT PRIMARY KEY,
        id_carga INT NOT NULL,
        id_producto INT NOT NULL,
        cantidad_cargada INT NOT NULL,
        cantidad_vendida INT NOT NULL DEFAULT 0,
        cantidad_devuelta INT NOT NULL DEFAULT 0,
        precio_ruta_unitario DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        costo_unitario DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        INDEX idx_det_carga (id_carga),
        INDEX idx_det_prod (id_producto)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // ─────────────────────────────────────────────────────────────────
    // 7. TABLA: ventas y detalle_ventas
    // ─────────────────────────────────────────────────────────────────
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ventas (
        id_venta INT AUTO_INCREMENT PRIMARY KEY,
        fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        total_venta DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        subtotal DECIMAL(10,2) NULL DEFAULT 0.00,
        descuento DECIMAL(10,2) NULL DEFAULT 0.00,
        tipo_pago VARCHAR(50) NULL,
        id_usuario INT NULL,
        id_cliente INT NULL,
        id_empleado INT NULL,
        id_carga INT NULL,
        estado VARCHAR(50) NOT NULL DEFAULT 'COMPLETADA',
        pago_detalles JSON NULL,
        tipo_venta VARCHAR(50) NOT NULL DEFAULT 'NORMAL',
        referencia_pedido INT NULL,
        metodo_pago VARCHAR(50) NULL,
        referencia_pago VARCHAR(100) NULL,
        numero_factura VARCHAR(50) NULL,
        caja_id INT NULL,
        INDEX idx_ventas_fecha (fecha),
        INDEX idx_ventas_cliente (id_cliente),
        INDEX idx_ventas_usuario (id_usuario),
        INDEX idx_ventas_empleado (id_empleado),
        INDEX idx_ventas_carga (id_carga),
        INDEX idx_ventas_tipo (tipo_venta)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    await addColumnSafe('ventas', 'id_carga', 'INT NULL');
    await addColumnSafe('ventas', 'id_empleado', 'INT NULL');
    await addColumnSafe('ventas', 'tipo_venta', "VARCHAR(50) NOT NULL DEFAULT 'NORMAL'");
    await addColumnSafe('ventas', 'numero_factura', 'VARCHAR(50) NULL');
    await addColumnSafe('ventas', 'subtotal', 'DECIMAL(10,2) NULL DEFAULT 0.00');
    await addColumnSafe('ventas', 'descuento', 'DECIMAL(10,2) NULL DEFAULT 0.00');
    await addColumnSafe('ventas', 'tipo_pago', 'VARCHAR(50) NULL');
    await addColumnSafe('ventas', 'metodo_pago', 'VARCHAR(50) NULL');
    await addColumnSafe('ventas', 'referencia_pago', 'VARCHAR(100) NULL');
    await addColumnSafe('ventas', 'referencia_pedido', 'INT NULL');
    await addColumnSafe('ventas', 'pago_detalles', 'JSON NULL');
    await addColumnSafe('ventas', 'caja_id', 'INT NULL');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS detalle_ventas (
        id_detalle INT AUTO_INCREMENT PRIMARY KEY,
        id_venta INT NULL,
        id_producto INT NULL,
        cantidad INT NOT NULL DEFAULT 1,
        precio_unitario DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        INDEX idx_detv_venta (id_venta),
        INDEX idx_detv_prod (id_producto)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // ─────────────────────────────────────────────────────────────────
    // 8. TABLA: movimientos_inventario (Auditoría)
    // ─────────────────────────────────────────────────────────────────
    await pool.query(`
      CREATE TABLE IF NOT EXISTS movimientos_inventario (
        id_movimiento INT AUTO_INCREMENT PRIMARY KEY,
        id_producto INT NOT NULL,
        tipo_movimiento VARCHAR(50) NOT NULL,
        detalles TEXT NULL,
        id_usuario INT NULL,
        fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_mov_prod (id_producto),
        INDEX idx_mov_fecha (fecha)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // ─────────────────────────────────────────────────────────────────
    // 9. TABLA: pedidos y detalle_pedidos (Apartados y Encargos)
    // ─────────────────────────────────────────────────────────────────
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pedidos (
        id_pedido INT AUTO_INCREMENT PRIMARY KEY,
        id_cliente INT NULL,
        nombre_cliente VARCHAR(255) NULL,
        total_pedido DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        abonado DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        estado VARCHAR(50) NOT NULL DEFAULT 'PENDIENTE',
        fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_ped_cli (id_cliente),
        INDEX idx_ped_est (estado)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    await addColumnSafe('pedidos', 'nombre_cliente', 'VARCHAR(255) NULL');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS detalle_pedidos (
        id_detalle_pedido INT AUTO_INCREMENT PRIMARY KEY,
        id_pedido INT NOT NULL,
        id_producto INT NOT NULL,
        cantidad INT NOT NULL DEFAULT 1,
        precio_unitario DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        INDEX idx_detp_pedido (id_pedido),
        INDEX idx_detp_prod (id_producto)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // ─────────────────────────────────────────────────────────────────
    // 10. TABLAS: ingresos y egresos (Finanzas)
    // ─────────────────────────────────────────────────────────────────
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ingresos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        monto DECIMAL(12,2) NOT NULL DEFAULT 0.00,
        descripcion TEXT NULL,
        id_usuario INT NULL,
        INDEX idx_ing_fecha (fecha)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS egresos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        monto DECIMAL(12,2) NOT NULL DEFAULT 0.00,
        descripcion TEXT NULL,
        tipo_egreso VARCHAR(100) NULL,
        id_usuario INT NULL,
        INDEX idx_egr_fecha (fecha)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // ─────────────────────────────────────────────────────────────────
    // 11. TABLA: facturas_proveedores (Cuentas por pagar a proveedores)
    // ─────────────────────────────────────────────────────────────────
    await pool.query(`
      CREATE TABLE IF NOT EXISTS facturas_proveedores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        proveedor VARCHAR(255) NOT NULL,
        numero_factura VARCHAR(100) NULL,
        fecha_emision DATE NULL,
        fecha_vencimiento DATE NULL,
        monto_total DECIMAL(12,2) NOT NULL DEFAULT 0.00,
        monto_abonado DECIMAL(12,2) NOT NULL DEFAULT 0.00,
        notas TEXT NULL,
        estado VARCHAR(50) NOT NULL DEFAULT 'PENDIENTE',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_facprov_estado (estado),
        INDEX idx_facprov_prov (proveedor)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // ─────────────────────────────────────────────────────────────────
    // 12. TABLA: creditos_cliente (Control de Cuentas por Cobrar)
    // ─────────────────────────────────────────────────────────────────
    await pool.query(`
      CREATE TABLE IF NOT EXISTS creditos_cliente (
        id INT AUTO_INCREMENT PRIMARY KEY,
        id_venta INT NOT NULL,
        id_cliente INT NOT NULL,
        monto_original DECIMAL(12,2) NOT NULL DEFAULT 0.00,
        saldo_restante DECIMAL(12,2) NOT NULL DEFAULT 0.00,
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
        estado ENUM('PENDIENTE','PAGADO','DEVUELTO') DEFAULT 'PENDIENTE',
        INDEX idx_cred_cli (id_cliente),
        INDEX idx_cred_vta (id_venta),
        INDEX idx_cred_est (estado)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // ─────────────────────────────────────────────────────────────────
    // 13. TABLA: cierres_caja (Caja Chica y Turnos)
    // ─────────────────────────────────────────────────────────────────
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
        INDEX idx_caja_usr (usuario_id),
        INDEX idx_caja_ap (fecha_apertura),
        INDEX idx_caja_ci (fecha_cierre)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    await addColumnSafe('cierres_caja', 'total_dolares', 'DECIMAL(12,2) DEFAULT 0');
    try {
      await pool.query('ALTER TABLE cierres_caja MODIFY COLUMN fecha_cierre DATETIME NULL DEFAULT NULL');
    } catch (e) {}

    // ─────────────────────────────────────────────────────────────────
    // 14. TABLA: active_carts (Carritos en Tiempo Real y Bloqueo de Stock)
    // ─────────────────────────────────────────────────────────────────
    await pool.query(`
      CREATE TABLE IF NOT EXISTS active_carts (
        user_id INT PRIMARY KEY,
        carts_json JSON,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // ─────────────────────────────────────────────────────────────────
    // 15. TABLA: inventory_outflows (Traslados, Cotizaciones y Salidas)
    // ─────────────────────────────────────────────────────────────────
    await pool.query(`
      CREATE TABLE IF NOT EXISTS inventory_outflows (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
        usuario_id INT,
        usuario_nombre VARCHAR(255),
        motivo TEXT,
        total_items INT,
        total_costo DECIMAL(10,2),
        total_venta DECIMAL(10,2),
        detalles_json JSON,
        tipo ENUM('SALIDA', 'COTIZACION') DEFAULT 'SALIDA',
        id_cliente INT NULL,
        cliente_nombre VARCHAR(255) NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_out_tipo (tipo),
        INDEX idx_out_usr (usuario_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    await addColumnSafe('inventory_outflows', 'tipo', "ENUM('SALIDA', 'COTIZACION') DEFAULT 'SALIDA'");
    await addColumnSafe('inventory_outflows', 'id_cliente', 'INT NULL');
    await addColumnSafe('inventory_outflows', 'cliente_nombre', 'VARCHAR(255) NULL');

    // ─────────────────────────────────────────────────────────────────
    // 16. TABLA: solicitudes (Peticiones internas / Notitas)
    // ─────────────────────────────────────────────────────────────────
    await pool.query(`
      CREATE TABLE IF NOT EXISTS solicitudes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        descripcion TEXT NOT NULL,
        estado ENUM('pendiente', 'completado') DEFAULT 'pendiente',
        fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        usuario_id INT,
        usuario_nombre VARCHAR(255),
        check_mark BOOLEAN DEFAULT FALSE,
        INDEX idx_sol_estado (estado)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // ─────────────────────────────────────────────────────────────────
    // 17. TABLA: business_config (Configuración del Negocio y Tickets)
    // ─────────────────────────────────────────────────────────────────
    await pool.query(`
      CREATE TABLE IF NOT EXISTS business_config (
        id INT PRIMARY KEY DEFAULT 1,
        empresa_nombre VARCHAR(255) DEFAULT 'Multirepuestos RG',
        empresa_ruc VARCHAR(50) DEFAULT '1211812770001E',
        empresa_telefono VARCHAR(100) DEFAULT '84031936 / 84058142',
        empresa_direccion TEXT,
        empresa_eslogan TEXT,
        empresa_logo_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ticket_sales_footer TEXT,
        ticket_proforma_footer TEXT,
        ticket_transfer_footer TEXT,
        label_width INT DEFAULT 190,
        label_height INT DEFAULT 30,
        label_logo_size INT DEFAULT 28,
        label_name_size INT DEFAULT 8,
        label_price_size INT DEFAULT 11,
        label_barcode_height INT DEFAULT 18
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    await pool.query('INSERT IGNORE INTO business_config (id) VALUES (1)');

    const configCols = [
      { name: 'ticket_sales_footer', type: 'TEXT' },
      { name: 'ticket_proforma_footer', type: 'TEXT' },
      { name: 'ticket_transfer_footer', type: 'TEXT' },
      { name: 'label_width', type: 'INT DEFAULT 190' },
      { name: 'label_height', type: 'INT DEFAULT 30' },
      { name: 'label_logo_size', type: 'INT DEFAULT 28' },
      { name: 'label_name_size', type: 'INT DEFAULT 8' },
      { name: 'label_price_size', type: 'INT DEFAULT 11' },
      { name: 'label_barcode_height', type: 'INT DEFAULT 18' }
    ];
    for (const col of configCols) {
      await addColumnSafe('business_config', col.name, col.type);
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ [DB AUTO-MIGRATOR] ¡Base de datos completamente actualizada y sincronizada!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    return true;
  } catch (error) {
    console.error('❌ [DB AUTO-MIGRATOR] Error durante la migración:', error);
    // No lanzar error fatal para que el servidor aún pueda intentar arrancar si fue un warning no crítico
    return false;
  }
};

module.exports = { runAllMigrations };
