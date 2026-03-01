const pool = require('./src/config/db');

(async () => {
    try {
        const [rows] = await pool.query('DESCRIBE business_config');
        console.log('--- Configuración de Tabla business_config ---');
        console.table(rows);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
})();
