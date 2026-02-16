require('dotenv').config();
const db = require('./src/config/db');

async function debugRead2() {
    console.log('📖 Searching for "GOLDEN"...');
    try {
        const connection = await db.getConnection();
        const [rows] = await connection.query("SELECT * FROM productos WHERE codigo LIKE '%MRGA71%' LIMIT 5");

        if (rows.length === 0) {
            console.log('❌ No "GOLDEN" products found.');
        } else {
            rows.forEach(p => {
                console.log(`🆔 ID: ${p.id_producto}, Code: '${p.codigo}', Name: '${p.nombre}', Provider: ${p.id_proveedor}`);
            });
        }

    } catch (e) {
        console.error('❌ Error:', e);
    }
    process.exit();
}

debugRead2();
