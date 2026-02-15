const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController.js');

// Importamos solo las funciones existentes y las renombramos para ser consistentes
const { verifyToken: protect, isAdmin } = require('../middleware/authMiddleware.js');

// Middleware de roles que simula el comportamiento de allowedRoles,
// pero usa la estructura de datos que 'verifyToken' adjunta a req.user (req.user.rol).
const allowedRolesMiddleware = (roles) => (req, res, next) => {
    // 1. Verificamos que el token haya adjuntado el rol
    if (!req.user || !req.user.rol) {
        return res.status(403).json({ msg: 'Acceso denegado. Rol no definido.' });
    }

    // 2. Verificamos si el rol del usuario está en la lista de roles permitidos
    const userRole = req.user.rol;
    if (roles.includes(userRole)) {
        next(); // El rol es permitido
    } else {
        // Error 403 Forbidden si el rol no está permitido
        return res.status(403).json({ msg: `Acceso denegado. Rol de ${userRole} no autorizado para esta acción.` });
    }
};

// POST /api/upload/inventory
router.post(
    '/inventory',
    protect, // Usamos la función verifyToken renombrada a 'protect'
    allowedRolesMiddleware(['Administrador', 'Encargado de Inventario']), // Usamos la función local
    uploadController.bulkUpdateInventory
);

// POST /api/upload/logo
router.post(
    '/logo',
    protect,
    allowedRolesMiddleware(['Administrador']),
    uploadController.uploadLogo
);

module.exports = router;
