
const db = require('./src/config/db');

async function fixSchema() {
    try {
        const connection = await db.getConnection();
        console.log('Connected to DB. Fixing schema...');

        // Change imagen to LONGTEXT to support large Base64 strings
        await connection.query('ALTER TABLE productos MODIFY COLUMN imagen LONGTEXT');
        console.log('SUCCESS: "imagen" column modified to LONGTEXT.');

        connection.release();
        process.exit(0);
    } catch (error) {
        console.error('ERROR:', error);
        process.exit(1);
    }
}

fixSchema();
