const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
        type: String,
        enum: ['Room', 'Entire Villa', 'Unique Stay'],
        required: true
    },
    location: { type: String, required: true },
    images: [{ type: String }], // Array of image URLs
    pricePerNight: { type: Number, required: true },
    maxGuests: { type: Number, required: true },
    minGuests: { type: Number, default: 1 },
    petsAllowed: { type: Boolean, default: false },
    amenities: [{ type: String }],
    approvalStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: { type: Date, default: Date.now }
});

const Property = mongoose.model('Property', propertySchema);
module.exports = Property;
