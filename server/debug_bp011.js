require('dotenv').config();
const mysql = require('mysql2/promise');

async function debug() {
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        console.log("=== SALE 4000 ===");
        const [saleItems] = await pool.query(`
            SELECT dv.id_venta, dv.id_producto, dv.cantidad, dv.precio_unitario, p.codigo, p.nombre 
            FROM detalle_ventas dv
            LEFT JOIN productos p ON dv.id_producto = p.id_producto
            WHERE dv.id_venta = 4000
        `);
        console.log(JSON.stringify(saleItems, null, 2));

        if (saleItems.length > 0) {
            const pid = saleItems[0].id_producto;
            console.log(`\nProduct ID in Sale 4000: ${pid}`);
            // Check if this ID corresponds to code BP011
            const [pCheck] = await pool.query("SELECT * FROM productos WHERE id_producto = ?", [pid]);
            console.log("DB Record for this ID:", pCheck[0]);

            // Check what ID corresponds to BP011
            const [bp011] = await pool.query("SELECT * FROM productos WHERE codigo = 'BP011'");
            console.log("\nDB Record for BP011:", bp011[0]);
        } else {
            console.log("Sale 4000 not found or has no items.");
        }

        await pool.end();
    } catch (e) {
        console.error(e);
    }
}

debug();
