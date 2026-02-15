const express = require('express');
const router = express.Router();
const controller = require('../controllers/providerInvoiceController');

// Rutas base: /api/facturas-proveedores
router.get('/', controller.getInvoices);
router.post('/', controller.createInvoice);
router.post('/:id/pagar', controller.registerPayment);
router.delete('/:id', controller.deleteInvoice);

module.exports = router;