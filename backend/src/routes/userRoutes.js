const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');
const { 
  getUsers, 
  getPetugas,
  getUserById,
  createUser, 
  updateUser, 
  deleteUser,
  changePassword
} = require('../controllers/userController');

// Apply rate limiting and authentication to all routes
router.use(apiLimiter, authMiddleware);

// === ADMIN ROUTES - COMMENTED OUT ===
// Get all users (admin only)
// router.get('/', roleMiddleware('admin'), getUsers);

// Get petugas list (admin and petugas can access)
router.get('/petugas', roleMiddleware('petugas'), getPetugas);

// Get user by ID (admin only)
// router.get('/:id', roleMiddleware('admin'), getUserById);

// Create new user (admin only)
// router.post('/', roleMiddleware('admin'), createUser);

// Update user (admin only)
// router.put('/:id', roleMiddleware('admin'), updateUser);

// Change user password (admin only)
// router.put('/:id/password', roleMiddleware('admin'), changePassword);

// Delete user (admin only)
// router.delete('/:id', roleMiddleware('admin'), deleteUser);
// === END ADMIN ROUTES ===

module.exports = router;
