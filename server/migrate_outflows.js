const pool = require('./src/config/db');

async function migrate() {
    console.log('🚀 Iniciando migración de la tabla inventory_outflows...');
    let connection;
    try {
        connection = await pool.getConnection();

        // 1. Agregar columna 'tipo'
        const [columns] = await connection.query('SHOW COLUMNS FROM inventory_outflows LIKE "tipo"');
        if (columns.length === 0) {
            console.log('--- Agregando columna "tipo"...');
            await connection.query('ALTER TABLE inventory_outflows ADD COLUMN tipo ENUM("SALIDA", "COTIZACION") DEFAULT "SALIDA" AFTER id');
        } else {
            console.log('--- Columna "tipo" ya existe.');
        }

        // 2. Agregar columna 'id_cliente'
        const [clientCol] = await connection.query('SHOW COLUMNS FROM inventory_outflows LIKE "id_cliente"');
        if (clientCol.length === 0) {
            console.log('--- Agregando columna "id_cliente"...');
            await connection.query('ALTER TABLE inventory_outflows ADD COLUMN id_cliente INT NULL AFTER usuario_nombre');
        } else {
            console.log('--- Columna "id_cliente" ya existe.');
        }

        // 3. Agregar columna 'cliente_nombre'
        const [clientNameCol] = await connection.query('SHOW COLUMNS FROM inventory_outflows LIKE "cliente_nombre"');
        if (clientNameCol.length === 0) {
            console.log('--- Agregando columna "cliente_nombre"...');
            await connection.query('ALTER TABLE inventory_outflows ADD COLUMN cliente_nombre VARCHAR(255) NULL AFTER id_cliente');
        } else {
            console.log('--- Columna "cliente_nombre" ya existe.');
        }

        console.log('✅ Migración completada con éxito.');
    } catch (error) {
        console.error('❌ Error durante la migración:', error);
    } finally {
        if (connection) connection.release();
        process.exit();
    }
}

migrate();
