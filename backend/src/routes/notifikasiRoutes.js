const express = require('express');
const router = express.Router();
const notifikasiController = require('../controllers/notifikasiController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', notifikasiController.getNotifikasi);
router.put('/:id/read', notifikasiController.markAsRead);
router.put('/read-all', notifikasiController.markAllAsRead);

module.exports = router;
