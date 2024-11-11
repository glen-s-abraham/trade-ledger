const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');
const logger = require('../config/logger');

// Register a new user
exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the email is already registered
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Create and save the new user
        user = new User({ email, password });
        await user.save();
        logger.info(`User registered with email: ${email}`);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        logger.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
};

// Log in an existing user
exports.login = (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) {
            logger.warn(`Login failed for email: ${req.body.email}`);
            return res.status(400).json({ message: info?.message || 'Login failed' });
        }

        const payload = { sub: user._id, email: user.email };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        logger.info(`User logged in with email: ${user.email}`);
        res.status(200).json({ token });
    })(req, res, next);
};

// Protected example route
exports.protected = (req, res) => {
    res.status(200).json({ message: 'Protected content', user: req.user });
};
