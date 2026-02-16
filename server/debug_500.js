require('dotenv').config();
const db = require('./src/config/db');

async function debug() {
    console.log('🔍 Starting Debug...');
    const connection = await db.getConnection();

    try {
        console.log('1️⃣ Testing "activo" column in products...');
        const [products] = await connection.query("SELECT id_producto, nombre, activo FROM products LIMIT 1"); // Intentionally 'products' or 'productos'? Schema says 'productos' usually. Code used 'productos'.
        // Wait, code uses 'productos'. Let's use 'productos'.
        // If 'products' table doesn't exist, that's a hint.
        // My controller uses 'productos'.
    } catch (e) {
        console.log('❌ Failed query on "products" (maybe typo in my manual test?):', e.message);
    }

    try {
        // Correct table name test
        console.log('2️⃣ Testing "productos" table with "activo" column...');
        const [rows] = await connection.query("SELECT id_producto, nombre, activo FROM productos LIMIT 1");
        console.log('✅ "productos" table OK. Sample:', rows[0]);
    } catch (e) {
        console.error('❌ Error in "productos" query:', e.message);
    }

    try {
        console.log('3️⃣ Testing "active_carts" table...');
        const [carts] = await connection.query("SELECT * FROM active_carts LIMIT 1");
        console.log('✅ "active_carts" table OK. Columns:', carts.length > 0 ? Object.keys(carts[0]) : 'Empty table');
    } catch (e) {
        console.error('❌ Error in "active_carts" query:', e.message);
    }

    console.log('🏁 Debug Finished.');
    process.exit();
}

debug();
