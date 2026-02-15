const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { getLogo, uploadLogo } = require('../controllers/logoController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getSettings);
router.put('/', verifyToken, isAdmin, updateSettings);

router.get('/logo', getLogo); // Public for tickets
router.post('/logo', verifyToken, isAdmin, uploadLogo);

module.exports = router;
