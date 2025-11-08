const express = require('express');
const router = express.Router();
const pengaduanController = require('../controllers/pengaduanController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { apiLimiter, createLimiter } = require('../middleware/rateLimiter');

router.use(apiLimiter, authMiddleware);

router.post('/', createLimiter, pengaduanController.createPengaduan);
router.get('/', pengaduanController.getPengaduan);
router.get('/statistics', roleMiddleware('admin', 'petugas'), pengaduanController.getStatistics);
router.get('/:id', pengaduanController.getPengaduanById);
router.put('/:id', pengaduanController.updatePengaduan);
router.delete('/:id', pengaduanController.deletePengaduan);
router.put('/:id/status', roleMiddleware('admin', 'petugas'), pengaduanController.updateStatus);
router.put('/:id/assign', roleMiddleware('admin'), pengaduanController.assignPetugas);

module.exports = router;
