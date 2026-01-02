const Broadcast = require('../models/Broadcast');
const Property = require('../models/Property');

// @desc    Create a broadcast request
// @route   POST /api/broadcasts
// @access  Private/Customer
const notificationService = require('../utils/notificationService');

// @desc    Create a broadcast request
// @route   POST /api/broadcasts
// @access  Private/Customer
const createBroadcast = async (req, res) => {
    try {
        const { location, checkInDate, checkOutDate, guests, pets, phone } = req.body;

        // Use provided phone or fallback to user's profile phone
        const phoneToUse = phone || req.user.phone;

        if (!phoneToUse) {
            return res.status(400).json({ message: 'Phone number is required. Please update your profile or provide one.' });
        }

        const broadcast = new Broadcast({
            customer: req.user._id,
            location,
            checkInDate,
            checkOutDate,
            guests,
            pets: pets || false,
            phone: phoneToUse
        });

        const savedBroadcast = await broadcast.save();

        // Populate user details for the immediate response/socket usage
        await savedBroadcast.populate('customer', 'username avatar email');

        // --- REAL-TIME NOTIFICATION SYSTEM (SMS & WhatsApp) ---
        // Find owners with properties in this location
        const properties = await Property.find({
            location: { $regex: location, $options: 'i' }
        }).populate('owner');

        const uniqueOwners = new Map();
        properties.forEach(prop => {
            if (prop.owner && prop.owner.phone) {
                uniqueOwners.set(prop.owner._id.toString(), prop.owner);
            }
        });

        // Send notifications asynchronously (don't block API response)
        const notificationPromises = Array.from(uniqueOwners.values()).map(owner =>
            notificationService.sendBroadcastNotification(owner, {
                location,
                checkInDate,
                checkOutDate,
                guests
            })
        );

        Promise.all(notificationPromises).catch(err => console.error('Notification Error:', err));

        res.status(201).json(savedBroadcast);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get broadcasts for owner's properties
// @route   GET /api/broadcasts/owner
// @access  Private/Owner
const getOwnerBroadcasts = async (req, res) => {
    try {
        // 1. Find all properties owned by this user
        const properties = await Property.find({ owner: req.user._id });

        // 2. Extract unique locations (case-insensitive usually preferred, but simple string match for now)
        const locations = [...new Set(properties.map(p => p.location))];

        if (locations.length === 0) {
            return res.status(200).json([]);
        }

        // 3. Find open broadcasts in those locations
        // Using regex for case-insensitive matching
        const locationRegexes = locations.map(loc => new RegExp(loc, 'i'));

        const broadcasts = await Broadcast.find({
            location: { $in: locationRegexes },
            status: 'open'
        })
            .populate('customer', 'username avatar email')
            .sort({ createdAt: -1 });

        res.status(200).json(broadcasts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Accept a broadcast request
// @route   PUT /api/broadcasts/:id/accept
// @access  Private/Owner
const acceptBroadcast = async (req, res) => {
    try {
        const broadcast = await Broadcast.findById(req.params.id);

        if (!broadcast) {
            return res.status(404).json({ message: 'Broadcast request not found' });
        }

        if (broadcast.status !== 'open') {
            return res.status(400).json({ message: 'This request has already been accepted' });
        }

        broadcast.status = 'accepted';
        broadcast.acceptedBy = req.user._id;
        await broadcast.save();

        res.status(200).json(broadcast);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createBroadcast,
    getOwnerBroadcasts,
    acceptBroadcast
};
