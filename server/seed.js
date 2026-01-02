require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Property = require('./models/Property');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/travel_platform');

        // 1. Create Owners
        const owner1 = await User.findOneAndUpdate(
            { email: 'owner1@example.com' },
            {
                username: 'Marco Polo',
                email: 'owner1@example.com',
                password: 'password123',
                role: 'owner',
                isSubscribed: true,
                accountStatus: 'active',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
            },
            { upsert: true, new: true }
        );

        const owner2 = await User.findOneAndUpdate(
            { email: 'owner2@example.com' },
            {
                username: 'Sarah Jenkins',
                email: 'owner2@example.com',
                password: 'password123',
                role: 'owner',
                isSubscribed: true,
                accountStatus: 'active',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
            },
            { upsert: true, new: true }
        );

        // 2. Create Properties with High-Quality Images
        const properties = [
            {
                owner: owner1._id,
                title: 'Azure Horizon Infinity Villa',
                description: 'A glass-walled masterpiece overlooking the Santorini caldera. Features a private infinity pool, futuristic interiors, and 360-degree sunset views.',
                category: 'Entire Villa',
                location: 'Santorini, Greece',
                pricePerNight: 850,
                maxGuests: 6,
                petsAllowed: false,
                approvalStatus: 'approved',
                images: [
                    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1613490493576-7fde63bac811?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80'
                ]
            },
            {
                owner: owner2._id,
                title: 'The Glass Forest Sanctuary',
                description: 'Stay in a mirrored treehouse deep in the Nordic woods. Total privacy, celestial views, and architectural brilliance.',
                category: 'Unique Stay',
                location: 'Lapland, Finland',
                pricePerNight: 420,
                maxGuests: 2,
                petsAllowed: true,
                approvalStatus: 'approved',
                images: [
                    'https://images.unsplash.com/photo-1500311717364-59fdb7837703?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80'
                ]
            },
            {
                owner: owner1._id,
                title: 'Cyberpunk Neon Suite',
                description: 'A high-tech studio apartment in the heart of Tokyo. Features smart-glass windows, neon ambient lighting, and panoramic city views.',
                category: 'Room',
                location: 'Tokyo, Japan',
                pricePerNight: 180,
                maxGuests: 2,
                petsAllowed: true,
                approvalStatus: 'approved',
                images: [
                    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80'
                ]
            },
            {
                owner: owner2._id,
                title: 'Malibu Echo Villa',
                description: 'Minimalist concrete and glass villa right on the cliffside. Hear the ocean from every room. Pure architectural silence.',
                category: 'Entire Villa',
                location: 'Malibu, USA',
                pricePerNight: 1200,
                maxGuests: 8,
                petsAllowed: false,
                approvalStatus: 'approved',
                images: [
                    'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80'
                ]
            }
        ];

        // Clear existing properties and seed new ones
        await Property.deleteMany({ location: { $in: ['Santorini, Greece', 'Lapland, Finland', 'Tokyo, Japan', 'Malibu, USA'] } });
        await Property.insertMany(properties);

        console.log('--- Seeding Complete ---');
        console.log('Owners Created:', owner1.email, owner2.email);
        console.log('Properties Seeded:', properties.length);

        process.exit();
    } catch (error) {
        console.error(`Error seeding: ${error.message}`);
        process.exit(1);
    }
};

seedData();
