// controllers/tradeController.js
const TradeEntry = require('../models/TradeEntry');
const logger = require('../config/logger');
const { Schema } = require('mongoose');

// Get all trade entries
exports.getAllTrades = async (req, res) => {
    try {
        const userId = req.user._id;  // Get the logged-in user's ID from req.user
        const trades = await TradeEntry.find({ user: userId }).populate('user', 'email');  // Populate with user email
        logger.info('Fetched all trade entries');
        res.status(200).json(trades);
    } catch (error) {
        logger.error('Error fetching trade entries:', error);
        res.status(500).json({ error: 'Error fetching trades' });
    }
};

// Get a trade entry by ID
exports.getTradeById = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find trade entry by ID and ensure it belongs to the logged-in user
        const trade = await TradeEntry.findOne({ _id: req.params.id, user: userId });

        if (!trade) {
            logger.warn(`Trade entry with ID ${req.params.id} not found`);
            return res.status(404).json({ message: 'Trade entry not found' });
        }

        logger.info(`Fetched trade entry with ID ${req.params.id}`);
        res.status(200).json(trade);
    } catch (error) {
        logger.error('Error fetching trade entry by ID:', error);
        res.status(400).json({ error: error.message });
    }
};

// Create a new trade entry
exports.createTrade = async (req, res) => {
    try {
        const userId = req.user._id;  // Get the logged-in user's ID from req.user (assuming JWT authentication)
        const newTrade = new TradeEntry({
            user: userId,
            stockSymbol: req.body.stockSymbol,
            transactionType: req.body.transactionType,
            quantity: req.body.quantity,
            price: req.body.price,
            tradeDate: req.body.tradeDate,
            status: req.body.status || 'Open',
        });
        const savedTrade = await newTrade.save();
        logger.info(`Created new trade entry with ID ${savedTrade._id}`);
        res.status(201).json(savedTrade);
    } catch (error) {
        logger.error('Error creating trade entry:', error);
        res.status(400).json({ error: error.message });
    }
};

// Update a trade entry by ID
exports.updateTrade = async (req, res) => {
    try {
        const userId = req.user._id;
        const updatedTrade = await TradeEntry.findOneAndUpdate(
            { _id: req.params.id, user: userId }, // Ensure trade belongs to the user
            req.body,
            { new: true }
        );
        if (!updatedTrade) {
            logger.warn(`Trade entry with ID ${req.params.id} not found for update`);
            return res.status(404).json({ message: 'Trade entry not found' });
        }
        logger.info(`Updated trade entry with ID ${req.params.id}`);
        res.status(200).json(updatedTrade);
    } catch (error) {
        logger.error('Error updating trade entry:', error);
        res.status(400).json({ error: error.message });
    }
};

// Delete a trade entry by ID
exports.deleteTrade = async (req, res) => {
    try {
        const userId = req.user._id;
        const deletedTrade = await TradeEntry.findOneAndDelete({
            _id: req.params.id,
            user: userId,
        });
        if (!deletedTrade) {
            logger.warn(`Trade entry with ID ${req.params.id} not found for deletion`);
            return res.status(404).json({ message: 'Trade entry not found' });
        }
        logger.info(`Deleted trade entry with ID ${req.params.id}`);
        res.status(200).json({ message: 'Trade entry deleted successfully' });
    } catch (error) {
        logger.error('Error deleting trade entry:', error);
        res.status(400).json({ error: error.message });
    }
};
