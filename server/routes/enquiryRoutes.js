const express = require('express');
const router = express.Router();
const { sendEnquiry, getOwnerEnquiries, updateEnquiryStatus, deleteEnquiry } = require('../controllers/enquiryController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, sendEnquiry);
router.get('/owner', protect, authorize('owner'), getOwnerEnquiries);
router.put('/:id', protect, authorize('owner'), updateEnquiryStatus);
router.delete('/:id', protect, authorize('owner'), deleteEnquiry);

module.exports = router;
