// src/routes/mayoristaRoutes.js

const express = require('express');
const router = express.Router();

const { verifyToken, isAdmin } = require('../middleware/authMiddleware.js');
const {
  getAllMayoristaProducts,
  getCatalogProducts,
  toggleCatalogStatus,
  updateMayoristaConfig,
  getCargasRuta,
  getDetalleCargaRuta,
  crearCargaRuta,
  liquidarCargaRuta,
  toggleComisionPagada,
  getClientesRuta,
  crearClienteRuta,
  getFacturasRuta,
  getDetalleFacturaRuta,
  crearFacturaRuta,
  getMayoristaMetrics
} = require('../controllers/mayoristaController.js');

// Todas las rutas del módulo mayorista son de acceso restringido solo para Administradores
router.use(verifyToken);
router.use(isAdmin);

/* ================= 0. Métricas del Sistema Mayorista ================= */
router.get('/metrics', getMayoristaMetrics);

/* ================= 1. Catálogo Mayorista y Precios ================= */
router.get('/products', getAllMayoristaProducts);
router.get('/catalog', getCatalogProducts);
router.patch('/products/:id/catalog', toggleCatalogStatus);
router.put('/products/:id/config', updateMayoristaConfig);

/* ================= 2. Inventario en Ruta (Cargas a Ruteros) ================= */
router.get('/cargas', getCargasRuta);
router.get('/cargas/:id', getDetalleCargaRuta);
router.post('/cargas', crearCargaRuta);
router.post('/cargas/:id/liquidar', liquidarCargaRuta);
router.patch('/cargas/:id/comision', toggleComisionPagada);

/* ================= 3. Clientes de Ruta Mayorista ================= */
router.get('/clientes', getClientesRuta);
router.post('/clientes', crearClienteRuta);

/* ================= 4. Facturación de Ruta Mayorista ================= */
router.get('/facturas', getFacturasRuta);
router.get('/facturas/:id', getDetalleFacturaRuta);
router.post('/facturas', crearFacturaRuta);

module.exports = router;
