require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

// Route Imports
const userRoutes = require('./routes/userRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');

const broadcastRoutes = require('./routes/broadcastRoutes');
const Property = require('./models/Property');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Database Connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/travel_platform');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};
connectDB();

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/broadcasts', broadcastRoutes);

// Socket.io Connection
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join a room based on user ID logic (client will emit this)
    socket.on('join_room', (userId) => {
        if (userId) {
            socket.join(userId);
            console.log(`User ${userId} joined room ${userId}`);
        }
    });

    // Handle Broadcast Search Event
    socket.on('broadcast_search', async (data) => {
        console.log('Received broadcast_search:', data);
        const { location, userDetails, broadcastId } = data;

        try {
            // 1. Find properties in the requested location (case-insensitive)
            const properties = await Property.find({
                location: { $regex: location, $options: 'i' }
            });

            // 2. Extract unique owner IDs
            const ownerIds = [...new Set(properties.map(p => p.owner.toString()))];
            console.log(`Found ${ownerIds.length} owners in ${location}`);

            // 3. Emit notification to each owner
            ownerIds.forEach(ownerId => {
                io.to(ownerId).emit('new_broadcast_request', {
                    message: `New request matching your property in ${location}!`,
                    data: {
                        ...data, // includes location, dates, guests, phone
                        createdAt: new Date()
                    }
                });
                console.log(`Emitted new_broadcast_request to owner ${ownerId}`);
            });

        } catch (error) {
            console.error('Socket Broadcast Error:', error);
        }
    });

    socket.on('disconnect', () => console.log('User disconnected:', socket.id));
});

app.set('socketio', io);

// Error Handling
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
