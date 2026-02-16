const db = require('./src/config/db');

async function migrate() {
    try {
        const connection = await db.getConnection();
        console.log('🔌 Conectado a la BD.');

        // 1. Verificar si la columna ya existe
        const [columns] = await connection.query("SHOW COLUMNS FROM productos LIKE 'activo'");

        if (columns.length > 0) {
            console.log('✅ La columna "activo" ya existe. No es necesario hacer nada.');
        } else {
            console.log('⚠️ La columna "activo" no existe. Agregándola...');
            await connection.query("ALTER TABLE productos ADD COLUMN activo TINYINT(1) NOT NULL DEFAULT 1");
            console.log('✅ Columna "activo" agregada correctamente.');
        }

        // 2. Verificar/Agregar columna 'imagen' si no existe (just in case)
        const [imgCols] = await connection.query("SHOW COLUMNS FROM productos LIKE 'imagen'");
        if (imgCols.length === 0) {
            console.log('⚠️ La columna "imagen" no existe. Agregándola...');
            await connection.query("ALTER TABLE productos ADD COLUMN imagen LONGTEXT NULL");
            console.log('✅ Columna "imagen" agregada correctamente.');
        } else {
            // Check type
            if (!imgCols[0].Type.includes('longtext') && !imgCols[0].Type.includes('mediumtext')) {
                console.log(`ℹ️ La columna "imagen" es tipo ${imgCols[0].Type}. Sugerencia: Cambiar a LONGTEXT si hay errores de tamaño.`);
                // Optional: await connection.query("ALTER TABLE productos MODIFY COLUMN imagen LONGTEXT NULL");
            }
        }

        connection.release();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error en la migración:', error);
        process.exit(1);
    }
}

migrate();
