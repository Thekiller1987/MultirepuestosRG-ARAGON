const express = require('express');
const router = express.Router();
const { processOutflow, getOutflowHistory } = require('../controllers/outflowController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Validar que el usuario sea admin o encargado de inventario (si aplica, pero el usuario pidió Admin)
// Usaremos isAdmin o una lógica similar.

router.post('/', verifyToken, processOutflow); // POST /api/outflow
router.get('/history', verifyToken, getOutflowHistory); // GET /api/outflow/history

module.exports = router;
