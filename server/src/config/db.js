// server/config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

// Crear pool de conexiones usando variables del .env
// Fix for Node.js 18+ preferring IPv6 causing ECONNREFUSED on localhost
const dbHost = (process.env.DB_HOST === 'localhost') ? '127.0.0.1' : (process.env.DB_HOST || '127.0.0.1');

const pool = mysql.createPool({
  host: dbHost,
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
