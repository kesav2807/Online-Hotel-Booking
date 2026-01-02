const express = require('express');
const router = express.Router();
const {
    registerUser,
    authUser,
    getUserProfile,
    getUsers,
    updateUserStatus,
    subscribeOwner,
    updateUserProfile
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Admin Routes
router.get('/', protect, authorize('admin'), getUsers);
router.put('/:id/status', protect, authorize('admin'), updateUserStatus);

// Owner Routes
router.post('/subscribe', protect, authorize('owner'), subscribeOwner);

module.exports = router;
