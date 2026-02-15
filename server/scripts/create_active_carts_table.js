const pool = require('../src/config/db');

(async () => {
    try {
        const connection = await pool.getConnection();
        console.log("Connected to DB. Creating 'active_carts' table...");

        await connection.query(`
      CREATE TABLE IF NOT EXISTS active_carts (
        user_id INT PRIMARY KEY,
        cart_data JSON,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

        console.log("Table 'active_carts' created or already exists.");
        connection.release();
        process.exit(0);
    } catch (error) {
        console.error("Error creating table:", error);
        process.exit(1);
    }
})();
