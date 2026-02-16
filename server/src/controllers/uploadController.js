/**
 * @file uploadController.js
 * @description Función de controlador para actualizar o insertar productos masivamente, 
 * incluyendo la lógica de mapeo de nombres de Categorías y Proveedores a IDs.
 */

const db = require('../config/db.js'); // Asegúrate de que esta ruta a tu conexión a la BD sea correcta

/**
 * Función auxiliar para buscar el ID de una categoría/proveedor por nombre.
 * Si no existe, lo crea y devuelve el nuevo ID.
 * @param {object} connection - La conexión de transacción.
 * @returns {number | null} - El ID de la entidad o null si el nombre es irrelevante/vacío.
 */
async function getOrCreateMappingId(connection, tableName, name, nameColumn, idColumn) {
    // Si el nombre está vacío o es un placeholder, devuelve NULL para la Foreign Key
    if (!name || String(name).trim() === '' || name.includes('- Sin Departamento -') || name.toUpperCase() === 'N/A') {
        return null;
    }
    const cleanName = String(name).trim();

    // 1. Intentar encontrar el ID existente
    try {
        // Usamos query en lugar de execute para manejar el formato de resultado dinámico del driver
        const [existing] = await connection.query(`SELECT ${idColumn} FROM ${tableName} WHERE ${nameColumn} = ?`, [cleanName]);
        if (existing.length > 0) {
            return existing[0][idColumn];
        }

        // 2. Si no existe, intentar crearlo
        const [result] = await connection.query(`INSERT INTO ${tableName} (${nameColumn}) VALUES (?)`, [cleanName]);
        return result.insertId;
    } catch (insertError) {
        if (insertError.code === 'ER_DUP_ENTRY') {
            // Reintentar buscar si otro hilo lo creó durante el mapeo
            const [retry] = await connection.query(`SELECT ${idColumn} FROM ${tableName} WHERE ${nameColumn} = ?`, [cleanName]);
            if (retry.length > 0) {
                return retry[0][idColumn];
            }
        }
        // Registramos el error y lo relanzamos
        console.error(`Error de MySQL al mapear/crear ${tableName} '${cleanName}':`, insertError.sqlMessage || insertError.message);
        throw insertError;
    }
}


/**
 * Procesa la carga masiva de productos (inventario).
 * @returns {object} - Informe de éxito/error al cliente.
 */
const bulkUpdateInventory = async (req, res) => { // 🚨 CAMBIADO A DECLARACIÓN CONST 🚨
    const products = req.body.items;
    const userId = req.user?.id_usuario ?? req.user?.id; // ID del usuario que realiza la carga

    if (!products || products.length === 0) {
        return res.status(400).json({ message: "No se proporcionaron datos de productos válidos para la carga masiva." });
    }

    let updatedCount = 0;
    let errorCount = 0;
    const errors = [];
    let connection;

    // SQL para el registro de movimientos de inventario
    const logSql = 'INSERT INTO movimientos_inventario (id_producto, tipo_movimiento, detalles, id_usuario) VALUES (?, ?, ?, ?)';

    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        let categoryMap = {}; // Cache para categorías
        let providerMap = {}; // Cache para proveedores
        const processedProducts = [];

        // --- 1. PROCESAR, SANEAR Y MAPEAR (BUSCAR IDS) CADA PRODUCTO ---
        for (const product of products) {

            // ⚠️ VALIDACIÓN CRÍTICA: Código y Nombre son obligatorios
            // Si falta alguno, lo marcamos como error y pasamos a la siguiente fila.
            const rawCodigo = String(product.codigo || '').trim();
            const rawNombre = String(product.nombre || '').trim();

            if (!rawCodigo || !rawNombre) {
                errorCount++;
                errors.push({ codigo: rawCodigo || 'N/A', error: 'El Código y el Nombre del Producto son campos obligatorios y no pueden estar vacíos.' });
                continue; // Saltar al siguiente item
            }

            try {
                // Mapeo de Categorías
                const departmentName = String(product.departamento || '').trim();
                const categoryMapKey = departmentName.toLowerCase();
                if (departmentName && !categoryMap[categoryMapKey]) {
                    categoryMap[categoryMapKey] = await getOrCreateMappingId(
                        connection, 'categorias', departmentName, 'nombre', 'id_categoria'
                    );
                }
                const id_categoria = categoryMap[categoryMapKey];

                // Mapeo de Proveedores
                const providerName = String(product.proveedor || '').trim();
                const providerMapKey = providerName.toLowerCase();
                if (providerName && !providerMap[providerMapKey]) {
                    providerMap[providerMapKey] = await getOrCreateMappingId(
                        connection, 'proveedores', providerName, 'nombre', 'id_proveedor'
                    );
                }
                const id_proveedor = providerMap[providerMapKey];

                // SANIDAD Y DEFENSA CONTRA VACÍOS
                const finalTipoVenta = String(product.tipo_venta || '').trim() || 'UNIDAD';

                // Valores numéricos: parseFloat() fallará si es una cadena vacía, 
                // por lo que usamos el || null o || 0 para manejar los vacíos de forma segura.
                // Usamos product.<campo> ya que el front-end ya limpió los símbolos de moneda ($,)
                const finalCosto = parseFloat(product.costo) || 0.00;
                // finalVenta calculated above in DEBUG block for safety
                const finalMayoreo = parseFloat(product.mayoreo) || null; // Opcional
                const finalMinimo = parseInt(product.minimo, 10) || null; // Opcional
                const finalMaximo = parseInt(product.maximo, 10) || null; // Opcional

                // DEBUG LOGGING START
                if (products.indexOf(product) < 3) { // Log only first 3 items to avoid spam
                    console.log(`DEBUG UPLOAD: Code=${rawCodigo}, Incoming Keys=${Object.keys(product).join(',')}`);
                    console.log(`DEBUG UPLOAD: Incoming Precio=${product.precio}, Venta=${product.venta}, Costo=${product.costo}`);
                }

                // ROBUST HANDLING FOR PRICE
                const rawPrice = product.precio !== undefined ? product.precio : (product.venta !== undefined ? product.venta : 0);
                const finalVenta = parseFloat(rawPrice) || 0.00;
                // DEBUG LOGGING END

                // Existencia es la cantidad que ENTRA. Debe ser un número (o 0 si está vacío)
                const entradaExistencia = parseInt(product.existencia, 10) || 0;

                processedProducts.push({
                    codigo: rawCodigo, nombre: rawNombre, tipo_venta: finalTipoVenta,
                    id_categoria: id_categoria, id_proveedor: id_proveedor,
                    costo: finalCosto, venta: finalVenta, mayoreo: finalMayoreo,
                    entrada_existencia: entradaExistencia, minimo: finalMinimo, maximo: finalMaximo,
                });

            } catch (mapError) {
                errorCount++;
                errors.push({ codigo: rawCodigo || 'N/A', error: `Error al mapear Categoría/Proveedor: ${mapError.message}` });
            }
        }

        // --- 2. QUERY DE INSERCIÓN/ACTUALIZACIÓN ÚNICA (UPSERT) ---

        // --- 2. EJECUCIÓN: SELECT -> UPDATE OR INSERT ---
        // Refactorizado para evitar problemas con ON DUPLICATE KEY UPDATE si no hay constraint único

        for (const saneProduct of processedProducts) {
            if (saneProduct.error) continue;

            try {
                // A. Verificar existencia por CÓDIGO
                const [existingRows] = await connection.query(
                    'SELECT id_producto, existencia FROM productos WHERE codigo = ?',
                    [saneProduct.codigo]
                );

                let productId = null;
                let isUpdate = false;
                let actionType = '';
                let logDetails = '';

                if (existingRows.length > 0) {
                    // --- ACTUALIZAR ---
                    isUpdate = true;
                    productId = existingRows[0].id_producto;
                    const oldStock = Number(existingRows[0].existencia);

                    // Actualizamos todos los campos
                    await connection.query(`
                        UPDATE productos SET 
                            nombre = ?, 
                            costo = ?, 
                            venta = ?, 
                            mayoreo = ?, 
                            tipo_venta = ?, 
                            id_categoria = ?, 
                            id_proveedor = ?, 
                            minimo = ?, 
                            maximo = ?,
                            existencia = existencia + ? 
                        WHERE id_producto = ?
                    `, [
                        saneProduct.nombre,
                        saneProduct.costo,
                        saneProduct.venta,
                        saneProduct.mayoreo,
                        saneProduct.tipo_venta,
                        saneProduct.id_categoria,
                        saneProduct.id_proveedor,
                        saneProduct.minimo,
                        saneProduct.maximo,
                        saneProduct.entrada_existencia,
                        productId
                    ]);

                    if (saneProduct.entrada_existencia > 0) {
                        actionType = 'ENTRADA_MASIVA';
                        logDetails = `Entrada: +${saneProduct.entrada_existencia}. Stock ${oldStock} -> ${oldStock + saneProduct.entrada_existencia}. Datos actualizados.`;
                    } else {
                        actionType = 'ACTUALIZACION_DATOS';
                        logDetails = `Actualización de datos (Precio: ${saneProduct.venta}, Costo: ${saneProduct.costo}). Stock sin cambios.`;
                    }

                } else {
                    // --- INSERTAR ---
                    const [insertResult] = await connection.query(`
                        INSERT INTO productos (
                            codigo, nombre, costo, venta, existencia, 
                            id_categoria, id_proveedor, tipo_venta, mayoreo, 
                            minimo, maximo
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `, [
                        saneProduct.codigo,
                        saneProduct.nombre,
                        saneProduct.costo,
                        saneProduct.venta,
                        saneProduct.entrada_existencia, // Stock inicial
                        saneProduct.id_categoria,
                        saneProduct.id_proveedor,
                        saneProduct.tipo_venta,
                        saneProduct.mayoreo,
                        saneProduct.minimo,
                        saneProduct.maximo
                    ]);

                    productId = insertResult.insertId;
                    actionType = 'CREACION_MASIVA';
                    logDetails = `Producto nuevo. Stock Inicial: ${saneProduct.entrada_existencia}. Precio: ${saneProduct.venta}.`;
                }

                // Registrar Historial
                if (actionType && productId) {
                    await connection.query(logSql, [productId, actionType, logDetails, userId]);
                }

                updatedCount++;

            } catch (rowError) {
                errorCount++;
                errors.push({ codigo: saneProduct.codigo, error: `Error BD: ${rowError.message}` });
                console.error(`Error procesando producto ${saneProduct.codigo}:`, rowError);
            }
        }

        if (errorCount > 0 && updatedCount === 0) {
            await connection.rollback();
            return res.status(400).json({ message: 'Error: Ningún producto pudo ser procesado con éxito.', errors });
        }

        await connection.commit(); // Confirmar todos los cambios si hubo al menos un éxito

        // Respuesta final al cliente (Multi-Status si hay errores parciales)
        const status = errorCount > 0 ? 207 : 200;

        return res.status(status).json({
            message: errorCount > 0
                ? `Carga procesada con éxito: ${updatedCount}. Hubo errores en ${errorCount} productos.`
                : `🎉 ¡Carga masiva completa! Se procesaron ${updatedCount} productos.`,
            count: updatedCount,
            errorCount: errorCount,
            errors: errors.filter(e => e.error) // Solo devolvemos los errores reales
        });

    } catch (dbError) {
        // Manejar errores de conexión o de la transacción
        if (connection) await connection.rollback();
        console.error('Error FATAL en la transacción de carga masiva:', dbError.stack || dbError);
        return res.status(500).json({ message: 'Error interno del servidor al procesar la carga masiva.' });
    } finally {
        if (connection) connection.release(); // Liberar la conexión
    }
};

const fs = require('fs');
const path = require('path');

/**
 * Sube un logo (Base64) y lo guarda en el servidor.
 */
const uploadLogo = async (req, res) => {
    try {
        const { image, filename } = req.body;
        if (!image) {
            return res.status(400).json({ message: 'No se proporcionó imagen.' });
        }

        // Crear directorio uploads si no existe
        const uploadDir = path.join(__dirname, '../../public/uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Limpiar base64 header (data:image/png;base64,...)
        const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            return res.status(400).json({ message: 'Formato de imagen inválido.' });
        }

        const buffer = Buffer.from(matches[2], 'base64');
        const safeName = (filename || 'logo.png').replace(/[^a-z0-9.]/gi, '_').toLowerCase();
        const finalName = `logo_${Date.now()}_${safeName}`;
        const filePath = path.join(uploadDir, finalName);

        fs.writeFileSync(filePath, buffer);

        // Retornar URL relativa (el server.js debe servir /uploads)
        // Asume que el servidor sirve 'public' o 'public/uploads' mapeado a URL
        const protocol = req.protocol;
        const host = req.get('host');
        // Construimos la URL completa para evitar problemas con rutas relativas en frontend
        const fileUrl = `${protocol}://${host}/uploads/${finalName}`;

        res.json({ url: fileUrl });
    } catch (error) {
        console.error('Error subiendo logo:', error);
        res.status(500).json({ message: 'Error al procesar la imagen.' });
    }
};

module.exports = {
    bulkUpdateInventory,
    uploadLogo
};
