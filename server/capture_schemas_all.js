require('dotenv').config();
const db = require('./src/config/db');
const fs = require('fs');

async function captureSchema() {
    try {
        const tables = ['ventas', 'detalle_ventas', 'clientes', 'usuarios'];
        const schemas = {};
        for (const table of tables) {
            const [cols] = await db.query(`SHOW COLUMNS FROM ${table}`);
            schemas[table] = cols;
        }
        fs.writeFileSync('schemas_all.json', JSON.stringify(schemas, null, 2));
        console.log("Schemas saved to schemas_all.json");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

captureSchema();
