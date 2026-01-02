const express = require('express');
const router = express.Router();
const {
    createProperty,
    getProperties,
    getMyProperties,
    updateApprovalStatus,
    updateProperty,
    deleteProperty,
    getPropertyById,
    adminGetProperties
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getProperties);
router.get('/my', protect, authorize('owner'), getMyProperties);
router.get('/admin/all', protect, authorize('admin'), adminGetProperties);
router.get('/:id', getPropertyById);
router.post('/', protect, authorize('owner'), createProperty);
router.put('/:id', protect, authorize('owner'), updateProperty);
router.delete('/:id', protect, authorize('owner'), deleteProperty);
router.put('/:id/approve', protect, authorize('admin'), updateApprovalStatus);

module.exports = router;
