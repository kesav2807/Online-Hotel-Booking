const Enquiry = require('../models/Enquiry');
const Property = require('../models/Property');

// @desc    Send interest/enquiry
// @route   POST /api/enquiries
// @access  Private/Customer
const sendEnquiry = async (req, res) => {
    try {
        const { propertyId, checkInDate, checkOutDate, guests, message } = req.body;

        const property = await Property.findById(propertyId);
        if (!property) return res.status(404).json({ message: 'Property not found' });

        const enquiry = new Enquiry({
            customer: req.user._id,
            property: propertyId,
            checkInDate,
            checkOutDate,
            guests,
            message
        });

        const savedEnquiry = await enquiry.save();

        // Emit socket event for real-time notification to owner
        const io = req.app.get('socketio');
        io.emit(`new_enquiry_${property.owner.toString()}`, {
            message: 'New enquiry received!',
            enquiryId: savedEnquiry._id
        });

        res.status(201).json(savedEnquiry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get enquiries for owner
// @route   GET /api/enquiries/owner
// @access  Private/Owner
const getOwnerEnquiries = async (req, res) => {
    try {
        const properties = await Property.find({ owner: req.user._id }).select('_id');
        const propertyIds = properties.map(p => p._id);

        const enquiries = await Enquiry.find({ property: { $in: propertyIds } })
            .populate('customer', 'username email phone avatar')
            .populate('property', 'title location')
            .sort({ createdAt: -1 });

        res.json(enquiries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update enquiry status (Accept/Reject)
// @route   PUT /api/enquiries/:id
// @access  Private/Owner
const updateEnquiryStatus = async (req, res) => {
    try {
        const enquiry = await Enquiry.findById(req.params.id);
        if (enquiry) {
            enquiry.status = req.body.status;
            const updatedEnquiry = await enquiry.save();

            // Emit socket event for real-time notification to customer
            const io = req.app.get('socketio');
            io.emit(`enquiry_update_${enquiry.customer.toString()}`, {
                message: `Your enquiry for property has been ${req.body.status}`,
                status: req.body.status
            });

            res.json(updatedEnquiry);
        } else {
            res.status(404).json({ message: 'Enquiry not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete enquiry
// @route   DELETE /api/enquiries/:id
// @access  Private/Owner
const deleteEnquiry = async (req, res) => {
    try {
        const enquiry = await Enquiry.findById(req.params.id);
        if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });

        await Enquiry.findByIdAndDelete(req.params.id);
        res.json({ message: 'Enquiry removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { sendEnquiry, getOwnerEnquiries, updateEnquiryStatus, deleteEnquiry };
