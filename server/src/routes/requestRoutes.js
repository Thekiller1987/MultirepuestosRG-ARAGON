const express = require('express');
const router = express.Router();
const { createRequest, getRequests, toggleRequestStatus, updateRequest, deleteRequest } = require('../controllers/requestController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.post('/', createRequest);
router.get('/', getRequests);
router.put('/:id/toggle', toggleRequestStatus);
router.put('/:id', updateRequest);
router.delete('/:id', deleteRequest);

module.exports = router;
