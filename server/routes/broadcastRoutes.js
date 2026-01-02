// Broadcast Routes
const express = require('express');
const router = express.Router();
const { createBroadcast, getOwnerBroadcasts, acceptBroadcast } = require('../controllers/broadcastController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, createBroadcast);
router.get('/owner', protect, authorize('owner'), getOwnerBroadcasts);
router.put('/:id/accept', protect, authorize('owner'), acceptBroadcast);

module.exports = router;
