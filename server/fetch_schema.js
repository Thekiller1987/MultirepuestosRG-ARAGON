require('dotenv').config();
const db = require('./src/config/db');

async function checkSchema() {
    try {
        console.log("Checking schema...");
        const [ventasCols] = await db.query("SHOW COLUMNS FROM ventas");
        console.log("VENTAS:", ventasCols.map(c => c.Field));

        const [detallesCols] = await db.query("SHOW COLUMNS FROM detalle_ventas");
        console.log("DETALLE_VENTAS:", detallesCols.map(c => c.Field));

        const [prodCols] = await db.query("SHOW COLUMNS FROM productos");
        console.log("PRODUCTOS:", prodCols.map(c => c.Field));

        const [clientCols] = await db.query("SHOW COLUMNS FROM clientes");
        console.log("CLIENTES:", clientCols.map(c => c.Field));

        const [userCols] = await db.query("SHOW COLUMNS FROM usuarios");
        console.log("USUARIOS:", userCols.map(c => c.Field));

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

checkSchema();
