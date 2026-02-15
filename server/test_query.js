require('dotenv').config();
const db = require('./src/config/db');

async function test() {
    try {
        const code = 'BP011';
        console.log(`Searching for product with code: ${code}`);

        const [products] = await db.query(
            `SELECT id_producto, nombre, codigo, venta AS precio, costo, existencia 
             FROM productos 
             WHERE codigo = ? OR codigo LIKE ? OR nombre LIKE ?
             LIMIT 20`,
            [code, `%${code}%`, `%${code}%`]
        );

        console.log(`Found ${products.length} products.`);
        if (products.length === 0) {
            console.log("No products found.");
            process.exit(0);
        }

        const productIds = products.map(p => p.id_producto);
        console.log("Product IDs:", productIds);

        const placeHolders = productIds.map(() => '?').join(',');
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

        console.log("Executing history query...");
        const [history] = await db.query(sql, productIds);
        console.log(`Found ${history.length} history records.`);

        process.exit(0);
    } catch (e) {
        console.error("ERROR DETECTED:");
        console.error(e);
        process.exit(1);
    }
}

test();
