// controllers/tradeController.js
const TradeEntry = require('../models/TradeEntry');
const logger = require('../config/logger');

// Get all trade entries
exports.getAllTrades = async (req, res) => {
    try {
        const trades = await TradeEntry.find();
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
        const trade = await TradeEntry.findById(req.params.id);
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
        const newTrade = new TradeEntry(req.body);
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
        const updatedTrade = await TradeEntry.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
        const deletedTrade = await TradeEntry.findByIdAndDelete(req.params.id);
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
