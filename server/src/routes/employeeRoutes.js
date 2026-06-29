// src/routes/employeeRoutes.js

const express = require('express');
const router = express.Router();

const { verifyToken, isAdmin } = require('../middleware/authMiddleware.js');
const {
    getAllEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
} = require('../controllers/employeeController.js');

// Todas las rutas requieren autenticación
router.use(verifyToken);

// GET /api/employees - Listar empleados (cualquier usuario autenticado)
router.get('/', getAllEmployees);

// POST /api/employees - Crear empleado (solo Admin)
router.post('/', isAdmin, createEmployee);

// PUT /api/employees/:id - Actualizar empleado (solo Admin)
router.put('/:id', isAdmin, updateEmployee);

// DELETE /api/employees/:id - Desactivar empleado (solo Admin)
router.delete('/:id', isAdmin, deleteEmployee);

module.exports = router;
