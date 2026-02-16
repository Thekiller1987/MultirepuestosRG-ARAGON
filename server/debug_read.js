require('dotenv').config();
const db = require('./src/config/db');

async function debugRead() {
    console.log('📖 Testing READ of MRGA71...');
    try {
        const connection = await db.getConnection();

        // Exact logic from getAllProducts (minus active check which was removed)
        const query = `
      SELECT p.*, c.nombre AS nombre_categoria, pr.nombre AS nombre_proveedor
      FROM productos p
      LEFT JOIN categorias c   ON p.id_categoria  = c.id_categoria
      LEFT   JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
      WHERE p.codigo = 'MRGA71'
    `;

        const [rows] = await connection.query(query);

        if (rows.length === 0) {
            console.log('❌ Product MRGA71 not found.');
        } else {
            console.log('✅ Product Found:', rows[0].nombre);
            console.log('🔑 id_proveedor (Raw DB):', rows[0].id_proveedor);
            console.log('🏷️ nombre_proveedor:', rows[0].nombre_proveedor);
            console.log('📦 Full Row Keys:', Object.keys(rows[0]));
        }

    } catch (e) {
        console.error('❌ Error:', e);
    }
    process.exit();
}

debugRead();
