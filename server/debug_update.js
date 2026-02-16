require('dotenv').config();
const db = require('./src/config/db');

async function debugUpdate() {
    console.log('✏️ Testing UPDATE of provider for Product 2...');
    try {
        const connection = await db.getConnection();

        const id = 2;
        const testProviderId = 18; // From previous log saw 18

        // 1. Verify product exists
        const [p] = await connection.query('SELECT * FROM productos WHERE id_producto = ?', [id]);
        if (!p.length) { console.error('Product 2 not found'); process.exit(); }
        console.log('Current Provider:', p[0].id_proveedor);

        // 2. Perform Update mimicking Controller
        const productData = {
            // Keep existing values
            codigo: p[0].codigo,
            nombre: p[0].nombre,
            costo: p[0].costo,
            venta: p[0].venta,
            minimo: p[0].minimo,
            maximo: p[0].maximo,
            id_categoria: p[0].id_categoria,

            // CHANGE PROVIDER
            id_proveedor: testProviderId, // Set to 18

            tipo_venta: p[0].tipo_venta,
            mayoreo: p[0].mayoreo,
            descripcion: p[0].descripcion,
            imagen: p[0].imagen
        };

        console.log('Updating with:', { id_proveedor: productData.id_proveedor });
        const [res] = await connection.query('UPDATE productos SET ? WHERE id_producto = ?', [productData, id]);
        console.log('Update Result:', res.affectedRows);

        // 3. Verify
        const [p2] = await connection.query('SELECT id_proveedor FROM productos WHERE id_producto = ?', [id]);
        console.log('New Provider:', p2[0].id_proveedor);

    } catch (e) {
        console.error('❌ Error:', e);
    }
    process.exit();
}

debugUpdate();
