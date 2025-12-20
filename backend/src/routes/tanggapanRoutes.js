const express = require('express');
const router = express.Router();
const tanggapanController = require('../controllers/tanggapanController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

router.use(apiLimiter, authMiddleware);

// Changed from roleMiddleware('admin', 'petugas') to only 'petugas'
router.post('/', roleMiddleware('petugas'), tanggapanController.createTanggapan);
router.get('/pengaduan/:pengaduan_id', tanggapanController.getTanggapanByPengaduan);

module.exports = router;
