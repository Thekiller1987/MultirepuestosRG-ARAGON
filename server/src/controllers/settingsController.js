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
                ticket_transfer_footer TEXT,
                label_width INT DEFAULT 190,
                label_height INT DEFAULT 30,
                label_logo_size INT DEFAULT 28,
                label_name_size INT DEFAULT 8,
                label_price_size INT DEFAULT 11,
                label_barcode_height INT DEFAULT 18
            )
        `);
        // Insert default if not exists
        await pool.query(`INSERT IGNORE INTO business_config (id) VALUES (1)`);

        // Migration for existing tables: Add columns if they don't exist
        const columns = [
            { name: 'ticket_sales_footer', type: 'TEXT' },
            { name: 'ticket_proforma_footer', type: 'TEXT' },
            { name: 'ticket_transfer_footer', type: 'TEXT' },
            { name: 'label_width', type: 'INT DEFAULT 190' },
            { name: 'label_height', type: 'INT DEFAULT 30' },
            { name: 'label_logo_size', type: 'INT DEFAULT 28' },
            { name: 'label_name_size', type: 'INT DEFAULT 8' },
            { name: 'label_price_size', type: 'INT DEFAULT 11' },
            { name: 'label_barcode_height', type: 'INT DEFAULT 18' }
        ];
        for (const col of columns) {
            try {
                const [rows] = await pool.query(`SHOW COLUMNS FROM business_config LIKE '${col.name}'`);
                if (rows.length === 0) {
                    await pool.query(`ALTER TABLE business_config ADD COLUMN ${col.name} ${col.type}`);
                    console.log(`✅ Columna ${col.name} agregada a business_config`);
                }
            } catch (e) {
                console.error(`Error verificando columna ${col.name}:`, e);
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
        ticket_sales_footer, ticket_proforma_footer, ticket_transfer_footer,
        label_width, label_height, label_logo_size,
        label_name_size, label_price_size, label_barcode_height
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
                ticket_transfer_footer = ?,
                label_width = ?,
                label_height = ?,
                label_logo_size = ?,
                label_name_size = ?,
                label_price_size = ?,
                label_barcode_height = ?
            WHERE id = 1
        `, [
            empresa_nombre, empresa_ruc, empresa_telefono,
            empresa_direccion, empresa_eslogan, empresa_logo_url,
            ticket_sales_footer, ticket_proforma_footer, ticket_transfer_footer,
            label_width, label_height, label_logo_size,
            label_name_size, label_price_size, label_barcode_height
        ]);

        const [updated] = await pool.query('SELECT * FROM business_config WHERE id = 1');
        res.json(updated[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar configuración' });
    }
};

module.exports = { getSettings, updateSettings, initSettings };
