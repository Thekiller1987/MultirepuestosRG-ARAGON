const express = require('express');
const router = express.Router();

const {
    getAllClients,
    createClient,
    updateClient,
    deleteClient,
    addCreditPayment,
    getCreditosByClient,
    getAbonosByClient,
    getCreditosPendientes,
} = require('../controllers/clientController');

const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.route('/')
    .get(getAllClients)
    .post(createClient);

router.route('/:id')
    .put(updateClient)
    .delete(deleteClient);

router.post('/:id/abono', addCreditPayment);
router.get('/:id/creditos', getCreditosByClient);
router.get('/:id/abonos', getAbonosByClient);
router.get('/:id/creditos-pendientes', getCreditosPendientes);

module.exports = router;