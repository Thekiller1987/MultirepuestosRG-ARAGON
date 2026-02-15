// server/src/routes/financeRoutes.js (FINAL Y BUENO)

const express = require('express');
const router = express.Router();

// DESESTRUCTURACIÓN COMPLETA del controlador de finanzas
const { 
    getAllIngresos, 
    createIngreso,
    getAllEgresos,
    createEgreso,
    getFinancialSummary
} = require('../controllers/financeController');

// DESESTRUCTURACIÓN COMPLETA del middleware
const { verifyToken, isAdmin } = require('../middleware/authMiddleware'); 

// Rutas para Ingresos (CRUD)
router.get('/ingresos', verifyToken, getAllIngresos);
router.post('/ingresos', verifyToken, isAdmin, createIngreso);

// Rutas para Egresos (CRUD)
router.get('/egresos', verifyToken, getAllEgresos);
router.post('/egresos', verifyToken, isAdmin, createEgreso);

// Ruta de resumen financiero
router.get('/summary', verifyToken, getFinancialSummary);

module.exports = router;