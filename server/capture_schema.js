require('dotenv').config();
const db = require('./src/config/db');
const fs = require('fs');

async function captureSchema() {
    try {
        const [prodCols] = await db.query("SHOW COLUMNS FROM productos");
        fs.writeFileSync('schema_productos.json', JSON.stringify(prodCols, null, 2));
        console.log("Schema saved to schema_productos.json");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

captureSchema();
