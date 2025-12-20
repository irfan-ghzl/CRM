const express = require('express');
const router = express.Router();
const kategoriController = require('../controllers/kategoriController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

router.get('/', kategoriController.getKategori);

// === ADMIN ROUTES - COMMENTED OUT ===
// router.post('/', apiLimiter, authMiddleware, roleMiddleware('admin'), kategoriController.createKategori);
// router.put('/:id', apiLimiter, authMiddleware, roleMiddleware('admin'), kategoriController.updateKategori);
// router.delete('/:id', apiLimiter, authMiddleware, roleMiddleware('admin'), kategoriController.deleteKategori);
// === END ADMIN ROUTES ===

module.exports = router;
