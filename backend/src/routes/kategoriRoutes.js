const express = require('express');
const router = express.Router();
const kategoriController = require('../controllers/kategoriController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

router.get('/', kategoriController.getKategori);
router.post('/', authMiddleware, roleMiddleware('admin'), kategoriController.createKategori);
router.put('/:id', authMiddleware, roleMiddleware('admin'), kategoriController.updateKategori);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), kategoriController.deleteKategori);

module.exports = router;
