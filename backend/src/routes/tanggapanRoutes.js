const express = require('express');
const router = express.Router();
const tanggapanController = require('../controllers/tanggapanController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

router.use(apiLimiter, authMiddleware);

router.post('/', roleMiddleware('admin', 'petugas'), tanggapanController.createTanggapan);
router.get('/pengaduan/:pengaduan_id', tanggapanController.getTanggapanByPengaduan);

module.exports = router;
