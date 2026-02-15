/**
 * @file productRoutes.js
 * @description Define las rutas de la API de productos.
 * @version 2.2.1
 */

const express = require('express');
const router = express.Router();

const { verifyToken /*, isAdmin */ } = require('../middleware/authMiddleware.js');
const productController = require('../controllers/productController.js');

/* Historial de movimientos de inventario */
router.get('/inventory/history', verifyToken, productController.getInventoryHistory);

/* CRUD de productos */
router.get('/', verifyToken, productController.getAllProducts);
router.get('/:id', verifyToken, productController.getProductById);
router.post('/', verifyToken, productController.createProduct);
router.put('/:id', verifyToken, productController.updateProduct);

/* Eliminar producto (si quieres solo admin: agrega isAdmin antes del controller) */
// router.delete('/:id', verifyToken, isAdmin, productController.deleteProduct);
router.delete('/:id', verifyToken, productController.deleteProduct);

/* Ajuste de stock */
router.patch('/:id/stock', verifyToken, productController.adjustStock);

/* Archivar (soft delete opcional). 
   En tu BD actual no existe la columna `activo`. 
   El controller responde 400 con la instrucción SQL sugerida si no está. */
router.patch('/:id/archive', verifyToken, productController.archiveProduct);

module.exports = router;
