const pool = require('../src/config/db');

async function createTable() {
    try {
        const query = `
      CREATE TABLE IF NOT EXISTS solicitudes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        descripcion TEXT NOT NULL,
        estado ENUM('pendiente', 'completado') DEFAULT 'pendiente',
        fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        usuario_id INT,
        usuario_nombre VARCHAR(255),
        check_mark BOOLEAN DEFAULT FALSE
      ) ENGINE=InnoDB;
    `;

        await pool.query(query);
        console.log("✅ Tabla 'solicitudes' verificada/creada correctamente.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error creando tabla:", error);
        process.exit(1);
    }
}

createTable();
