// src/controllers/reportController.js

const db = require('../config/db');

/**
 * Helper para construir rango de fechas optimizado (Business Day 6AM - 6AM)
 * @param {string} start YYYY-MM-DD
 * @param {string} end YYYY-MM-DD
 * @returns {{ from: string, to: string }}
 */
const getDateRange = (start, end) => {
    // Si start=2023-10-25, rango inicia 2023-10-25 06:00:00
    // Si end=2023-10-25, rango termina 2023-10-26 05:59:59
    const from = `${start} 06:00:00`;

    // Calcular siguiente día para el end
    const dateEnd = new Date(end);
    dateEnd.setDate(dateEnd.getDate() + 1);
    const year = dateEnd.getFullYear();
    const month = String(dateEnd.getMonth() + 1).padStart(2, '0');
    const day = String(dateEnd.getDate()).padStart(2, '0');
    const to = `${year}-${month}-${day} 05:59:59`;

    return { from, to };
};

// --- OBTENER RESUMEN DE VENTAS Y GANANCIAS ---
const getSalesSummaryReport = async (req, res) => {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
        return res.status(400).json({ msg: 'Por favor, especifica una fecha de inicio y fin.' });
    }
    try {
        const { from, to } = getDateRange(startDate, endDate);
        const sql = `
            SELECT
                COALESCE(SUM(dv.cantidad * dv.precio_unitario), 0) AS ventas_brutas,
                COALESCE(SUM(dv.cantidad * (dv.precio_unitario - p.costo)), 0) AS ganancia_total
            FROM ventas AS v
            JOIN detalle_ventas AS dv ON v.id_venta = dv.id_venta
            JOIN productos AS p ON dv.id_producto = p.id_producto
            WHERE 
                v.estado = 'COMPLETADA' 
                AND v.fecha >= ? AND v.fecha <= ?;
        `;
        const [results] = await db.query(sql, [from, to]);
        res.json(results[0]);
    } catch (error) {
        console.error('Error en reporte de resumen de ventas:', error);
        res.status(500).json({ msg: 'Error en el servidor.' });
    }
};

// --- OBTENER VALOR TOTAL DEL INVENTARIO ---
// --- OBTENER VALOR TOTAL DEL INVENTARIO (CON DESGLOSE) ---
const getInventoryValueReport = async (req, res) => {
    try {
        const connection = await db.getConnection();

        // 1. Total General
        const sqlTotal = `
            SELECT COALESCE(SUM(costo * existencia), 0) AS valor_total_inventario
            FROM productos;
        `;
        const [totalRows] = await connection.query(sqlTotal);

        // 2. Desglose de "Culpables" (Top 50 por valor total)
        const sqlBreakdown = `
            SELECT 
                id_producto, 
                nombre, 
                codigo, 
                costo, 
                existencia, 
                (costo * existencia) as valor_total
            FROM productos
            ORDER BY valor_total DESC
            LIMIT 50;
        `;
        const [breakdownRows] = await connection.query(sqlBreakdown);

        connection.release();

        res.json({
            valor_total_inventario: totalRows[0].valor_total_inventario,
            breakdown: breakdownRows
        });

    } catch (error) {
        console.error('Error en reporte de valor de inventario:', error);
        res.status(500).json({ msg: 'Error en el servidor.' });
    }
};

// --- OBTENER VENTAS POR USUARIO (TOP VENDEDORES) ---
const getSalesByUserReport = async (req, res) => {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) return res.status(400).json({ msg: 'Fechas requeridas.' });
    try {
        const { from, to } = getDateRange(startDate, endDate);
        const sql = `
            SELECT 
                u.nombre_usuario, 
                COUNT(v.id_venta) AS cantidad_ventas, 
                SUM(v.total_venta) AS total_vendido
            FROM ventas AS v
            JOIN usuarios AS u ON v.id_usuario = u.id_usuario
            WHERE 
                v.estado = 'COMPLETADA' 
                AND v.fecha >= ? AND v.fecha <= ?
            GROUP BY u.nombre_usuario 
            ORDER BY total_vendido DESC;
        `;
        const [results] = await db.query(sql, [from, to]);
        res.json(results);
    } catch (error) {
        console.error('Error en reporte de ventas por usuario:', error);
        res.status(500).json({ msg: 'Error en el servidor.' });
    }
};

// --- OBTENER PRODUCTOS MÁS VENDIDOS ---
const getTopProductsReport = async (req, res) => {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) return res.status(400).json({ msg: 'Fechas requeridas.' });
    try {
        const { from, to } = getDateRange(startDate, endDate);
        const sql = `
            SELECT p.nombre, SUM(dv.cantidad) AS total_unidades_vendidas
            FROM detalle_ventas AS dv
            JOIN productos AS p ON dv.id_producto = p.id_producto
            JOIN ventas AS v ON dv.id_venta = v.id_venta
            WHERE 
                v.estado = 'COMPLETADA' 
                AND v.fecha >= ? AND v.fecha <= ?
            GROUP BY p.nombre 
            ORDER BY total_unidades_vendidas DESC 
            LIMIT 10;
        `;
        const [results] = await db.query(sql, [from, to]);
        res.json(results);
    } catch (error) {
        console.error('Error en reporte de top productos:', error);
        res.status(500).json({ msg: 'Error en el servidor.' });
    }
};

// --- OBTENER DATOS PARA LA GRÁFICA ---
const getSalesChartReport = async (req, res) => {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) return res.status(400).json({ msg: 'Fechas requeridas.' });
    try {
        const { from, to } = getDateRange(startDate, endDate);
        // Nota: Para agrupar por día, seguimos usando DATE() pero sobre un rango filtrado eficientemente
        const sql = `
            SELECT 
                DATE(DATE_SUB(fecha, INTERVAL 6 HOUR)) AS dia, 
                SUM(total_venta) AS total_diario
            FROM ventas
            WHERE 
                estado = 'COMPLETADA' 
                AND fecha >= ? AND fecha <= ?
            GROUP BY dia 
            ORDER BY dia ASC;
        `;
        const [results] = await db.query(sql, [from, to]);
        res.json(results);
    } catch (error) {
        console.error('Error en reporte para gráfica:', error);
        res.status(500).json({ msg: 'Error en el servidor.' });
    }
};

// --- OBTENER VENTAS DETALLADAS CON PRODUCTOS, CLIENTES, VENDEDORES ---
const getDetailedSales = async (req, res) => {
    const { startDate, endDate, tipo, keyword, clientId } = req.query;
    if (!startDate || !endDate) return res.status(400).json({ msg: 'Fechas requeridas.' });
    try {
        const { from, to } = getDateRange(startDate, endDate);

        let tipoFilter = '';
        if (tipo === 'DEVOLUCION') {
            tipoFilter = ` AND v.estado = 'DEVOLUCION'`;
        } else if (tipo === 'COMPLETADA') {
            tipoFilter = ` AND v.estado = 'COMPLETADA'`;
        } else if (tipo === 'CANCELADA') {
            tipoFilter = ` AND v.estado = 'CANCELADA'`;
        }

        let keywordFilter = '';
        let clientFilter = '';
        const params = [from, to];

        if (clientId) {
            clientFilter = ` AND v.id_cliente = ?`;
            params.push(clientId);
        }

        if (keyword && keyword.trim() !== '') {
            keywordFilter = ` AND EXISTS (
                SELECT 1 FROM detalle_ventas dv2
                JOIN productos p2 ON dv2.id_producto = p2.id_producto
                WHERE dv2.id_venta = v.id_venta
                AND (p2.nombre LIKE ? OR p2.codigo LIKE ?)
            )`;
            params.push(`%${keyword}%`, `%${keyword}%`);
        }

        // OPTIMIZACIÓN: Rango directo en 'fecha' usa índice.
        const [sales] = await db.query(`
            SELECT 
                v.id_venta AS id,
                v.fecha,
                v.total_venta AS totalVenta,
                v.subtotal,
                v.descuento,
                v.estado,
                v.pago_detalles AS pagoDetalles,
                v.tipo_venta,
                v.id_usuario AS userId,
                v.id_cliente AS clientId,
                c.nombre AS clienteNombre,
                u.nombre_usuario AS vendedorNombre
            FROM ventas v
            LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
            LEFT JOIN usuarios u ON v.id_usuario = u.id_usuario
            WHERE v.fecha >= ? AND v.fecha <= ?
            ${tipoFilter}
            ${clientFilter}
            ${keywordFilter}
            ORDER BY v.fecha DESC
            LIMIT 500
        `, params);

        if (!sales.length) return res.json([]);

        const saleIds = sales.map(s => s.id);

        // Optimización: Traer detalles solo de las ventas filtradas
        const [details] = await db.query(`
            SELECT 
                dv.id_venta,
                p.id_producto AS id,
                p.nombre,
                p.codigo,
                dv.cantidad AS quantity,
                dv.precio_unitario AS precio
            FROM detalle_ventas dv
            JOIN productos p ON dv.id_producto = p.id_producto
            WHERE dv.id_venta IN (?)
        `, [saleIds]);

        // Mapeo en memoria (O(N) en lugar de O(N^2) filter)
        // Agrupar detalles por venta
        const detailsMap = {};
        details.forEach(d => {
            if (!detailsMap[d.id_venta]) detailsMap[d.id_venta] = [];
            detailsMap[d.id_venta].push(d);
        });

        const salesWithDetails = sales.map(sale => ({
            ...sale,
            pagoDetalles: typeof sale.pagoDetalles === 'string' ? (() => { try { return JSON.parse(sale.pagoDetalles); } catch { return {}; } })() : (sale.pagoDetalles || {}),
            items: detailsMap[sale.id] || []
        }));

        res.json(salesWithDetails);
    } catch (error) {
        console.error('Error en reporte detallado de ventas:', error);
        res.status(500).json({ msg: 'Error en el servidor.' });
    }
};

// --- HISTORIAL DE UN PRODUCTO ESPECÍFICO POR CÓDIGO ---
const getProductHistory = async (req, res) => {
    const { code } = req.query;
    if (!code) return res.status(400).json({ msg: 'Código de producto requerido.' });
    try {
        // console.log(`[getProductHistory] Searching for code: "${code}"`);

        // 1. Encontrar producto(s) coincidentes
        let products = [];
        // Change 'precio' to 'venta AS precio' alias to keep frontend compatible
        const [rows] = await db.query(
            `SELECT id_producto, nombre, codigo, venta AS precio, costo, existencia 
             FROM productos 
             WHERE codigo = ? OR codigo LIKE ? OR nombre LIKE ?
             LIMIT 20`,
            [code, `%${code}%`, `%${code}%`]
        );
        products = rows;

        if (req.query.searchOnly) {
            return res.json(products);
        }

        if (!products.length) return res.json({ product: null, history: [] });

        // Ordenar: Exact match primero
        products.sort((a, b) => {
            const aExact = (a.codigo === code);
            const bExact = (b.codigo === code);
            if (aExact && !bExact) return -1;
            if (!aExact && bExact) return 1;
            return a.nombre.localeCompare(b.nombre);
        });

        const product = products[0];
        const productIds = products.map(p => p.id_producto);

        // 2. Obtener Historial
        let history = [];
        if (productIds.length > 0) {
            // Manual placeholder construction to ensure compatibility
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
            `;

            // Pass flattened productIds array
            const [histResults] = await db.query(sql, productIds);
            history = histResults;
        }

        res.json({ product, products, history });

    } catch (error) {
        console.error('CRITICAL ERROR in getProductHistory:', error);
        res.status(500).json({
            msg: 'Error de servidor buscando historial',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

module.exports = {
    getSalesSummaryReport,
    getInventoryValueReport,
    getSalesByUserReport,
    getTopProductsReport,
    getSalesChartReport,
    getDetailedSales,
    getProductHistory
};