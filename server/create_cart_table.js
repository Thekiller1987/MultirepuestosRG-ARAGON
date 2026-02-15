require('dotenv').config();
const mysql = require('mysql2/promise');

async function createCartTable() {
    console.log('Iniciando creación de tabla active_carts...');

    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'appuser',
        password: process.env.DB_PASSWORD || 'AppSegura_2025!',
        database: process.env.DB_DATABASE || 'multirepuestosrg'
    });

    try {
        const connection = await pool.getConnection();
        console.log('Conectado a la BD.');

        await connection.query(`
      CREATE TABLE IF NOT EXISTS active_carts (
        user_id INT PRIMARY KEY,
        carts_json JSON,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

        console.log('✅ ÉXITO: Tabla active_carts creada/verificada.');
        connection.release();
    } catch (error) {
        console.error('❌ ERROR:', error.message);
    } finally {
        await pool.end();
    }
}

createCartTable();
