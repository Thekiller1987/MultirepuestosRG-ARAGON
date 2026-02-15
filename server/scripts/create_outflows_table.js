const db = require('../src/config/db');

async function createInventoryOutflowsTable() {
    try {
        const connection = await db.getConnection();
        console.log('🔌 Conectado a la base de datos.');

        await connection.query(`
      CREATE TABLE IF NOT EXISTS inventory_outflows (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
        usuario_id INT,
        usuario_nombre VARCHAR(255),
        motivo TEXT,
        total_items INT,
        total_costo DECIMAL(10, 2),
        total_venta DECIMAL(10, 2),
        detalles_json JSON,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

        console.log('✅ Tabla "inventory_outflows" verificada/creada exitosamente.');
        connection.release();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creando la tabla:', error);
        process.exit(1);
    }
}

createInventoryOutflowsTable();
