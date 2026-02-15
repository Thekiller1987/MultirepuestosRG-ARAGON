// src/routes/reportRoutes.js

const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middleware/authMiddleware');
const {
    getSalesSummaryReport,
    getInventoryValueReport,
    getSalesByUserReport,
    getTopProductsReport,
    getSalesChartReport,
    getDetailedSales,
    getProductHistory
} = require('../controllers/reportController');

// --- RUTAS PARA REPORTES ---

// GET /api/reports/sales-summary?startDate=...&endDate=...
router.get('/sales-summary', verifyToken, getSalesSummaryReport);

// GET /api/reports/inventory-value
router.get('/inventory-value', verifyToken, getInventoryValueReport);

// GET /api/reports/sales-by-user?startDate=...&endDate=...
router.get('/sales-by-user', verifyToken, getSalesByUserReport);

// GET /api/reports/top-products?startDate=...&endDate=...
router.get('/top-products', verifyToken, getTopProductsReport);

// GET /api/reports/sales-chart?startDate=...&endDate=...
router.get('/sales-chart', verifyToken, getSalesChartReport);

// GET /api/reports/detailed-sales?startDate=...&endDate=...&tipo=...
router.get('/detailed-sales', verifyToken, getDetailedSales);

// GET /api/reports/product-history?code=...
router.get('/product-history', verifyToken, getProductHistory);

module.exports = router;