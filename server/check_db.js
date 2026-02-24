const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            port: process.env.DB_PORT || 3306
        });

        const [rows] = await connection.query('DESCRIBE creditos_cliente');
        console.log("=== creditos_cliente Schema ===");
        console.table(rows);

        await connection.end();
    } catch (error) {
        console.error("ERROR:", error.message);
    }
})();
