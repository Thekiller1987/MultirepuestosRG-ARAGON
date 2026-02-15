// server/src/routes/providerRoutes.js (CORREGIDO)

const express = require('express');
const router = express.Router();

// Importamos las funciones del controlador
const { getAllProviders, createProvider, deleteProvider } = require('../controllers/providerController.js');

// *** CORRECCIÓN CRÍTICA: Cambiar 'protect' por 'verifyToken' al importar ***
const { verifyToken, isAdmin } = require('../middleware/authMiddleware.js');

router.route('/')
  .get(verifyToken, getAllProviders) // Usamos verifyToken en lugar de protect
  .post(verifyToken, isAdmin, createProvider);

router.route('/:id')
  .delete(verifyToken, isAdmin, deleteProvider); // Usamos verifyToken

module.exports = router;