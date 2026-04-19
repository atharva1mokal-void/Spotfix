const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const auth = require('../middleware/auth');

// Register a new user
router.post('/register', authController.registerUser);

// Admin provision user
router.post('/provision', auth, authController.provisionUser);

// Login user
router.post('/login', authController.loginUser);

// Get current user profile
router.get('/me', auth, authController.getMe);

// Get all users (Admin)
router.get('/users', auth, authController.getAllUsers);

// Toggle user ban (Admin)
router.patch('/users/:id/ban', auth, authController.toggleBanUser);

module.exports = router;
