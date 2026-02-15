// server/config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

// Crear pool de conexiones usando variables del .env
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'appuser',
  password: process.env.DB_PASSWORD || 'AppSegura_2025!',
  database: process.env.DB_DATABASE || 'multirepuestosrg',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test rápido de conexión
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('¡Conexión a la base de datos exitosa! 🎉');
    conn.release();
  } catch (e) {
    console.error('Error al conectar con la base de datos (DB.JS):', e.message);
  }
})();

module.exports = pool;
