// server/src/routes/categoryRoutes.js (CORREGIDO)

const express = require('express');
const router = express.Router();

// Importamos TODAS las funciones que necesitamos del controlador
const { getAllCategories, createCategory, deleteCategory } = require('../controllers/categoryController.js');

// *** CORRECCIÓN CRÍTICA: Cambiar 'protect' por 'verifyToken' al importar ***
// Asegúrate de que esta desestructuración coincida con lo que exporta tu authMiddleware.js
const { verifyToken, isAdmin } = require('../middleware/authMiddleware.js');

router.route('/')
  .get(verifyToken, getAllCategories) // Usamos verifyToken en lugar de protect
  .post(verifyToken, isAdmin, createCategory);

router.route('/:id')
  .delete(verifyToken, isAdmin, deleteCategory); // Usamos verifyToken

module.exports = router;