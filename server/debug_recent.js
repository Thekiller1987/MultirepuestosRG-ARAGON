require('dotenv').config();
const db = require('./src/config/db');

async function debugRecent() {
    console.log('📖 Listing 5 most recent products...');
    try {
        const connection = await db.getConnection();
        const [rows] = await connection.query("SELECT id_producto, codigo, nombre, activo FROM productos ORDER BY id_producto DESC LIMIT 5");

        rows.forEach(p => {
            console.log(`🆔 ID: ${p.id_producto}, Code: '${p.codigo}', Name: '${p.nombre}', Active: ${p.activo}`);
        });

    } catch (e) {
        console.error('❌ Error:', e);
    }
    process.exit();
}

debugRecent();
