require('dotenv').config();
const db = require('./src/config/db');

async function checkSchema() {
    try {
        console.log("--- PRODUCTOS ---");
        const [prodCols] = await db.query("SHOW COLUMNS FROM productos");
        console.log(prodCols.map(c => c.Field).join(', '));

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

checkSchema();
