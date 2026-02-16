require('dotenv').config();
const db = require('./src/config/db');

async function debugColumns() {
    console.log('🔍 Checking "productos" columns...');
    try {
        const connection = await db.getConnection();
        const [cols] = await connection.query("SHOW COLUMNS FROM productos");
        const fields = cols.map(c => c.Field);
        console.log('Columns:', fields.join(', '));

        if (fields.includes('minimo')) console.log('✅ minimo exists');
        else console.log('❌ minimo MISSING');

        if (fields.includes('maximo')) console.log('✅ maximo exists');
        else console.log('❌ maximo MISSING');

    } catch (e) {
        console.error('❌ Error:', e);
    }
    process.exit();
}

debugColumns();
