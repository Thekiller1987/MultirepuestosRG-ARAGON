require('dotenv').config();
const db = require('./src/config/db');

async function debugProvider() {
    console.log('🔍 Checking Product Provider...');
    try {
        const connection = await db.getConnection();

        // Check product ID 2 (from screenshot log)
        const [rows] = await connection.query(`
      SELECT p.id_producto, p.nombre, p.id_proveedor, pr.nombre as nombre_proveedor
      FROM productos p
      LEFT JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
      WHERE p.id_producto = 2
    `);

        if (rows.length > 0) {
            console.log('✅ Product Found:', rows[0]);
        } else {
            console.log('❌ Product ID 2 not found.');
        }

        // List all providers to check IDs
        const [providers] = await connection.query('SELECT id_proveedor, nombre FROM proveedores LIMIT 5');
        console.log('📋 Valid Providers:', providers);

    } catch (e) {
        console.error('❌ Error:', e.message);
    }
    process.exit();
}

debugProvider();
