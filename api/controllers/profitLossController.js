// controllers/profitLossController.js
const ProfitLoss = require('../models/ProfitLoss');
const logger = require('../config/logger');

// Get cumulative profit, loss, and net profit or loss for all trades of the authenticated user
exports.getCumulativeProfitLoss = async (req, res) => {
    try {
        const userId = req.user._id;

        // Aggregate total profit, total loss, and net profit or loss for all trades of the user
        const result = await ProfitLoss.aggregate([
            { $match: { user: userId } },
            {
                $group: {
                    _id: null,
                    totalProfit: {
                        $sum: {
                            $cond: { if: { $gt: ["$profitOrLoss", 0] }, then: "$profitOrLoss", else: 0 }
                        }
                    },
                    totalLoss: {
                        $sum: {
                            $cond: { if: { $lt: ["$profitOrLoss", 0] }, then: "$profitOrLoss", else: 0 }
                        }
                    }
                }
            }
        ]);

        // Extract totals or default to 0 if no records
        const totalProfit = result.length > 0 ? result[0].totalProfit : 0;
        const totalLoss = result.length > 0 ? Math.abs(result[0].totalLoss) : 0; // Convert loss to positive for display
        const netProfit = totalProfit - totalLoss;

        logger.info(`Calculated cumulative profit, loss, and net PnL for user ${userId}`);
        res.status(200).json({ totalProfit, totalLoss, netProfit });
    } catch (error) {
        logger.error('Error calculating cumulative profit, loss, and net PnL:', error);
        res.status(500).json({ error: 'Error calculating cumulative profit, loss, and net PnL' });
    }
};

// Get cumulative profit or loss grouped by stock symbol for the authenticated user
exports.getSymbolWiseProfitLoss = async (req, res) => {
    try {
        const userId = req.user._id;

        // Aggregate total profit or loss for each stock symbol
        const result = await ProfitLoss.aggregate([
            { $match: { user: userId } },
            {
                $group: {
                    _id: "$stockSymbol",
                    totalProfitOrLoss: { $sum: "$profitOrLoss" }
                }
            },
            {
                $project: {
                    _id: 0,
                    stockSymbol: "$_id",
                    totalProfitOrLoss: 1
                }
            }
        ]);

        logger.info(`Calculated symbol-wise cumulative profit or loss for user ${userId}`);
        res.status(200).json(result);
    } catch (error) {
        logger.error('Error calculating symbol-wise profit or loss:', error);
        res.status(500).json({ error: 'Error calculating symbol-wise profit or loss' });
    }
};

// Get cumulative profit or loss within a specified date range
exports.getDateFilteredProfitLoss = async (req, res) => {
    try {
        const userId = req.user._id;
        const { startDate, endDate } = req.query;

        // Build the filter for date range
        const filter = { user: userId };

        // Apply date range filter if provided
        if (startDate || endDate) {
            filter.sellDate = {}; // Only include sellDate if startDate or endDate is provided
            if (startDate) {
                filter.sellDate.$gte = new Date(startDate);
            }
            if (endDate) {
                filter.sellDate.$lte = new Date(endDate);
            }
        }

        // Aggregate total profit or loss for the specified date range
        const result = await ProfitLoss.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: null,
                    totalProfitOrLoss: { $sum: "$profitOrLoss" }
                }
            }
        ]);

        // Extract total profit or loss or default to 0 if no records
        const totalProfitOrLoss = result.length > 0 ? result[0].totalProfitOrLoss : 0;

        logger.info(`Calculated profit or loss within date range for user ${userId}`);
        res.status(200).json({ totalProfitOrLoss });
    } catch (error) {
        logger.error('Error calculating profit or loss within date range:', error);
        res.status(500).json({ error: 'Error calculating profit or loss within date range' });
    }
};

exports.getSymbolWiseDateFilteredProfitLoss = async (req, res) => {
    try {
        const userId = req.user._id;
        const { startDate, endDate } = req.query;

        // Build the filter for date range and user
        const filter = { user: userId };

        // Apply date range filter if provided
        if (startDate || endDate) {
            filter.sellDate = {}; // Only include sellDate if startDate or endDate is provided
            if (startDate) {
                filter.sellDate.$gte = new Date(startDate);
            }
            if (endDate) {
                filter.sellDate.$lte = new Date(endDate);
            }
        }

        // Aggregate total profit or loss grouped by stock symbol within the specified date range
        const result = await ProfitLoss.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: "$stockSymbol",
                    totalProfitOrLoss: { $sum: "$profitOrLoss" }
                }
            },
            {
                $project: {
                    _id: 0,
                    stockSymbol: "$_id",
                    totalProfitOrLoss: 1
                }
            }
        ]);

        logger.info(`Calculated symbol-wise profit or loss within date range for user ${userId}`);
        res.status(200).json(result);
    } catch (error) {
        logger.error('Error calculating symbol-wise profit or loss within date range:', error);
        res.status(500).json({ error: 'Error calculating symbol-wise profit or loss within date range' });
    }
};