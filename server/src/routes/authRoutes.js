const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController.js');

// Ruta para el login de un usuario
// POST /api/auth/login
router.post('/login', login);

// Ruta para registrar un nuevo usuario
// POST /api/auth/register
router.post('/register', register);

module.exports = router;
