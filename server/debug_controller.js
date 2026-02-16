require('dotenv').config();
const db = require('./src/config/db');

async function debugController() {
    console.log('🏁 Starting Controller Debug...');
    try {
        const query = `
      SELECT p.*, c.nombre AS nombre_categoria, pr.nombre AS nombre_proveedor
      FROM productos p
      LEFT JOIN categorias c   ON p.id_categoria  = c.id_categoria
      LEFT   JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
      WHERE p.activo = 1
      ORDER BY p.nombre ASC
    `;
        console.log('1. Extrayendo productos...');
        const [rows] = await db.query(query);
        console.log(`productos encontrados: ${rows.length}`);

        console.log('2. Extrayendo carritos...');
        const requestingUserId = -1;
        const [carts] = await db.query(
            "SELECT user_id, carts_json FROM active_carts WHERE updated_at > NOW() - INTERVAL 60 MINUTE AND user_id != ?",
            [requestingUserId]
        );
        console.log(`carritos encontrados: ${carts.length}`);

        // Processing logic
        console.log('3. Procesando carritos...');
        const reservedMap = new Map();
        carts.forEach(c => {
            try {
                let items = c.carts_json;
                if (typeof items === 'string') {
                    items = JSON.parse(items);
                }
                if (!items) items = [];

                if (Array.isArray(items)) {
                    items.forEach(ticket => {
                        if (ticket.items && Array.isArray(ticket.items)) {
                            ticket.items.forEach(item => {
                                const pid = item.id_producto || item.id;
                                const qty = Number(item.quantity || item.cantidad || 0);
                                reservedMap.set(pid, (reservedMap.get(pid) || 0) + qty);
                            });
                        }
                    });
                }
            } catch (e) {
                console.error('Error parsing cart:', e);
            }
        });

        console.log('4. Mapeando productos...');
        const products = rows.map(p => {
            const pid = p.id_producto;
            const reserved = reservedMap.get(pid) || 0;
            const disponible = Math.max(0, p.existencia - reserved);

            return {
                ...p,
                existencia: p.existencia,
                disponible: disponible,
                reserved: reserved,
                imagen: p.imagen ? (Buffer.isBuffer(p.imagen) ? p.imagen.toString('utf-8') : p.imagen) : null
            };
        });

        console.log('✅ Controller logic success. First product:', products[0] ? products[0].nombre : 'None');

    } catch (error) {
        console.error('❌ CRASH in controller logic:', error);
    }
    process.exit();
}

debugController();
