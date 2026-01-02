const Property = require('../models/Property');

// @desc    Create new property
// @route   POST /api/properties
// @access  Private/Owner
const createProperty = async (req, res) => {
    try {
        const { title, description, category, location, pricePerNight, maxGuests, minGuests, images, petsAllowed } = req.body;

        const property = new Property({
            owner: req.user._id,
            title,
            description,
            category,
            location,
            pricePerNight,
            maxGuests,
            minGuests: minGuests || 1,
            images,
            petsAllowed: petsAllowed || false
        });

        const savedProperty = await property.save();
        res.status(201).json(savedProperty);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const Enquiry = require('../models/Enquiry'); // Added import

// @desc    Get all properties (Search with filters)
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res) => {
    try {
        const { location, category, guests, pets, startDate, endDate } = req.query;
        let query = { approvalStatus: 'approved' };

        // 1. Basic Filters
        if (location) query.location = { $regex: location, $options: 'i' };
        if (category) query.category = category;
        if (guests) query.maxGuests = { $gte: Number(guests) };
        if (pets === 'true') query.petsAllowed = true;

        // 2. Fetch all matching properties
        let properties = await Property.find(query)
            .populate({
                path: 'owner',
                select: 'username email isSubscribed accountStatus'
            })
            .sort({ createdAt: -1 });

        // 3. Date Availability Filter (The "Professional" Logic)
        if (startDate && endDate) {
            const requestedStart = new Date(startDate);
            const requestedEnd = new Date(endDate);

            // Find all accepted enquiries that overlap with these dates
            const busyEnquiries = await Enquiry.find({
                status: 'accepted',
                $or: [
                    { checkInDate: { $lt: requestedEnd, $gte: requestedStart } },
                    { checkOutDate: { $gt: requestedStart, $lte: requestedEnd } },
                    { checkInDate: { $lte: requestedStart }, checkOutDate: { $gte: requestedEnd } }
                ]
            }).select('property');

            const busyPropertyIds = busyEnquiries.map(e => e.property.toString());
            properties = properties.filter(p => !busyPropertyIds.includes(p._id.toString()));
        }

        // 4. Owner Account Status Filter
        const visibleProperties = properties.filter(p => {
            if (!p.owner) return false;
            return p.owner.accountStatus === 'active';
        });

        res.json(visibleProperties);
    } catch (error) {
        console.error('Fetch Properties Error:', error);
        res.status(500).json({ message: 'Error retrieving properties' });
    }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private/Owner
const updateProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (property && property.owner.toString() === req.user._id.toString()) {
            Object.assign(property, req.body);
            const updatedProperty = await property.save();
            res.json(updatedProperty);
        } else {
            res.status(404).json({ message: 'Property not found or unauthorized' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Allow if user is owner OR admin
        if (property.owner.toString() === req.user._id.toString() || req.user.role === 'admin') {
            await property.deleteOne();
            res.json({ message: 'Property removed successfully' });
        } else {
            res.status(401).json({ message: 'Not authorized to delete this property' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get owner properties
// @route   GET /api/properties/my
// @access  Private/Owner
const getMyProperties = async (req, res) => {
    try {
        const properties = await Property.find({ owner: req.user._id });
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update property approval status (Admin)
// @route   PUT /api/properties/:id/approve
// @access  Private/Admin
const updateApprovalStatus = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (property) {
            property.approvalStatus = req.body.status || 'approved';
            const updatedProperty = await property.save();
            res.json(updatedProperty);
        } else {
            res.status(404).json({ message: 'Property not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id).populate('owner', 'username email phone avatar isSubscribed');
        if (property) {
            res.json(property);
        } else {
            res.status(404).json({ message: 'Property not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all properties for Admin (includes pending)
// @route   GET /api/properties/admin/all
// @access  Private/Admin
const adminGetProperties = async (req, res) => {
    try {
        const properties = await Property.find({}).populate('owner', 'username email isSubscribed');
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createProperty,
    getProperties,
    getMyProperties,
    updateApprovalStatus,
    updateProperty,
    deleteProperty,
    getPropertyById,
    adminGetProperties
};
