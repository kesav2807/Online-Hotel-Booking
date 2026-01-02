const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
    const { username, email, password, role, phone } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
        username,
        email,
        password,
        role: role || 'customer',
        phone
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            role: user.role,
            token: generateToken(user._id, user.role),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
    const { identifier, password } = req.body; // Can be email or username

    const user = await User.findOne({
        $or: [{ email: identifier }, { username: identifier }]
    });

    if (user && (await user.matchPassword(password))) {
        if (user.accountStatus === 'suspended') {
            return res.status(403).json({ message: 'Account suspended. Please contact support.' });
        }
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isSubscribed: user.isSubscribed,
            token: generateToken(user._id, user.role),
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            phone: user.phone,
            isSubscribed: user.isSubscribed
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users);
};

// @desc    Update user status (Admin)
// @route   PUT /api/users/:id/status
// @access  Private/Admin
const updateUserStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { accountStatus: status },
            { new: true, runValidators: true }
        ).select('-password');

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Update User Status Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update subscription (simulation)
// @route   POST /api/users/subscribe
// @access  Private/Owner
const subscribeOwner = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.isSubscribed = true;
        // set expiry to 30 days from now
        user.subscriptionExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await user.save();
        res.json({ message: 'Subscription successful', expiry: user.subscriptionExpiry });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const updateData = {};
        if (req.body.username) updateData.username = req.body.username;
        if (req.body.phone) updateData.phone = req.body.phone;
        if (req.body.avatar) updateData.avatar = req.body.avatar;

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
            avatar: updatedUser.avatar,
            phone: updatedUser.phone,
            isSubscribed: updatedUser.isSubscribed,
            token: generateToken(updatedUser._id, updatedUser.role),
        });
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({
            message: 'Server Error during profile update',
            details: error.message
        });
    }
};

module.exports = { registerUser, authUser, getUserProfile, getUsers, updateUserStatus, subscribeOwner, updateUserProfile };
