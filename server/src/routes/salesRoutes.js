const express = require('express');
const router = express.Router();
const { createSale, getSales, createReturn, cancelSale, syncCart } = require('../controllers/salesController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.route('/')
    .post(createSale)
    .get(getSales);

router.post('/returns', createReturn);
router.post('/sync-cart', syncCart);

router.delete('/:id', isAdmin, cancelSale);

module.exports = router;