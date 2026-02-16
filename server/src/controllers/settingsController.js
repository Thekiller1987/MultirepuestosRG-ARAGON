const pool = require('../config/db');

// AUTO-MIGRACIÓN: Tabla business_config
// AUTO-MIGRACIÓN: Tabla business_config
const initSettings = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS business_config (
                id INT PRIMARY KEY DEFAULT 1,
                empresa_nombre VARCHAR(255) DEFAULT 'Multirepuestos RG',
                empresa_ruc VARCHAR(50) DEFAULT '1211812770001E',
                empresa_telefono VARCHAR(100) DEFAULT '84031936 / 84058142',
                empresa_direccion TEXT,
                empresa_eslogan TEXT,
                empresa_logo_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                ticket_sales_footer TEXT,
                ticket_proforma_footer TEXT,
                ticket_transfer_footer TEXT
            )
        `);
        // Insert default if not exists
        await pool.query(`INSERT IGNORE INTO business_config (id) VALUES (1)`);

        // Migration for existing tables: Add columns if they don't exist
        const columns = ['ticket_sales_footer', 'ticket_proforma_footer', 'ticket_transfer_footer'];
        for (const col of columns) {
            try {
                // Check if column exists first to avoid error spam
                const [rows] = await pool.query(`SHOW COLUMNS FROM business_config LIKE '${col}'`);
                if (rows.length === 0) {
                    await pool.query(`ALTER TABLE business_config ADD COLUMN ${col} TEXT`);
                    console.log(`✅ Columna ${col} agregada a business_config`);
                }
            } catch (e) {
                console.error(`Error verificando columna ${col}:`, e);
            }
        }
    } catch (error) {
        console.error('Error inicializando business_config:', error);
    }
};

/* ===================== READ ===================== */
const getSettings = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM business_config WHERE id = 1');
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'Configuración no encontrada' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener configuración' });
    }
};

/* ===================== UPDATE ===================== */
const updateSettings = async (req, res) => {
    const {
        empresa_nombre, empresa_ruc, empresa_telefono,
        empresa_direccion, empresa_eslogan, empresa_logo_url,
        ticket_sales_footer, ticket_proforma_footer, ticket_transfer_footer
    } = req.body;

    try {
        await pool.query(`
            UPDATE business_config 
            SET 
                empresa_nombre = ?, 
                empresa_ruc = ?, 
                empresa_telefono = ?, 
                empresa_direccion = ?, 
                empresa_eslogan = ?, 
                empresa_logo_url = ?,
                ticket_sales_footer = ?,
                ticket_proforma_footer = ?,
                ticket_transfer_footer = ?
            WHERE id = 1
        `, [
            empresa_nombre, empresa_ruc, empresa_telefono,
            empresa_direccion, empresa_eslogan, empresa_logo_url,
            ticket_sales_footer, ticket_proforma_footer, ticket_transfer_footer
        ]);

        const [updated] = await pool.query('SELECT * FROM business_config WHERE id = 1');
        res.json(updated[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar configuración' });
    }
};

module.exports = { getSettings, updateSettings, initSettings };
