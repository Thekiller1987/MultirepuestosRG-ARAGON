const fs = require('fs');
const path = require('path');
const pool = require('../src/config/db');

(async () => {
    try {
        const sqlPath = path.join(__dirname, 'cierre_caja_migration.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');
        // Simple split by ; might break if text contains ;, but for this specific schema it's fine.
        // Better to execute the whole thing if the driver supports multi-statements,
        // but mysql2 usually executes one statement.
        // The schema is just one CREATE TABLE statement mostly.

        await pool.query(sql);
        console.log('Migration successful!');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
})();
