const express = require('express');
const router = express.Router();
const notifikasiController = require('../controllers/notifikasiController');
const { authMiddleware } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

router.use(apiLimiter, authMiddleware);

router.get('/', notifikasiController.getNotifikasi);
router.put('/:id/read', notifikasiController.markAsRead);
router.put('/read-all', notifikasiController.markAllAsRead);

module.exports = router;
