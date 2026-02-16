require('dotenv').config();
const db = require('./src/config/db');

async function debugProvider() {
    try {
        const connection = await db.getConnection();
        const [rows] = await connection.query(`
      SELECT p.id_producto, p.nombre, p.id_proveedor
      FROM productos p
      WHERE p.id_producto = 2
    `);
        console.log('PRODUCT_2:', rows[0]);

        if (rows[0] && rows[0].id_proveedor) {
            const [prov] = await connection.query('SELECT * FROM proveedores WHERE id_proveedor = ?', [rows[0].id_proveedor]);
            console.log('PROVIDER_DETAILS:', prov[0]);
        }
    } catch (e) {
        console.error(e);
    }
    process.exit();
}

debugProvider();
