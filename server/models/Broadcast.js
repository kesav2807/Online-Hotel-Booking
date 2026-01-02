const mongoose = require('mongoose');

const broadcastSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    location: { type: String, required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    guests: { type: Number, required: true },
    pets: { type: Boolean, default: false },
    phone: { type: String, required: true },
    status: {
        type: String,
        enum: ['open', 'accepted'],
        default: 'open'
    },
    acceptedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: { type: Date, default: Date.now }
});

const Broadcast = mongoose.model('Broadcast', broadcastSchema);
module.exports = Broadcast;
