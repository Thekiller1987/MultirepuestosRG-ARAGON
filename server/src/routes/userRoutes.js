const express = require('express');
const router = express.Router();

// Importamos TODAS las funciones que necesitamos del controlador
const { getAllUsers, updateUser, deleteUser } = require('../controllers/userController.js');

// *** CORRECCIÓN CRÍTICA AQUÍ ***
// Renombramos 'protect' por 'verifyToken' al importar, ya que así se llama en el middleware.
const { verifyToken, isAdmin } = require('../middleware/authMiddleware.js'); 

// Ruta para obtener todos los usuarios (GET) y crear uno nuevo (POST, aunque lo hacemos desde authRoutes)
router.route('/')
  .get(verifyToken, isAdmin, getAllUsers); // Usamos verifyToken

// Rutas para un usuario específico por su ID
router.route('/:id')
  .put(verifyToken, isAdmin, updateUser)      // Usamos verifyToken
  .delete(verifyToken, isAdmin, deleteUser);  // Usamos verifyToken

module.exports = router;