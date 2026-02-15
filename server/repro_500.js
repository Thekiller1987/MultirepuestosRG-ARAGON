require('dotenv').config();
const db = require('./src/config/db');

async function debug() {
    try {
        const code = 'BP011';
        console.log(`Searching for code: "${code}"`);

        // 1. Encontrar producto(s) coincidentes
        let products = [];
        const [rows] = await db.query(
            `SELECT id_producto, nombre, codigo, venta AS precio, costo, existencia 
             FROM productos 
             WHERE codigo = ? OR codigo LIKE ? OR nombre LIKE ?
             LIMIT 20`,
            [code, `%${code}%`, `%${code}%`]
        );
        products = rows;
        console.log(`Found ${products.length} products`);

        if (!products.length) return;

        // Ordenar: Exact match primero
        products.sort((a, b) => {
            const aExact = (a.codigo === code);
            const bExact = (b.codigo === code);
            if (aExact && !bExact) return -1;
            if (!aExact && bExact) return 1;
            return a.nombre.localeCompare(b.nombre);
        });

        const productIds = products.map(p => p.id_producto);
        console.log('Product IDs:', productIds);

        // 2. Obtener Historial
        if (productIds.length > 0) {
            // Manual placeholder construction
            const placeHolders = productIds.map(() => '?').join(',');
            console.log('Placeholders:', placeHolders);

            const sql = `
                SELECT 
                    v.id_venta AS idVenta,
                    v.fecha,
                    v.estado,
                    v.tipo_venta,
                    dv.cantidad,
                    p.codigo AS codigoProducto,
                    dv.precio_unitario AS precioUnitario,
                    c.nombre AS clienteNombre,
                    c.id_cliente AS clienteId,
                    u.nombre_usuario AS vendedorNombre
                FROM detalle_ventas dv
                JOIN ventas v ON dv.id_venta = v.id_venta
                JOIN productos p ON dv.id_producto = p.id_producto
                LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
                LEFT JOIN usuarios u ON v.id_usuario = u.id_usuario
                WHERE dv.id_producto IN (${placeHolders})
                ORDER BY v.fecha DESC
                LIMIT 200
            `;

            console.log('Executing SQL...');
            const [histResults] = await db.query(sql, productIds); // Running the query exactly as in controller
            console.log(`History found: ${histResults.length} entries`);
        }

        console.log('Done.');
        process.exit(0);

    } catch (error) {
        console.error('CRITICAL ERROR:', error);
        process.exit(1);
    }
}

debug();
