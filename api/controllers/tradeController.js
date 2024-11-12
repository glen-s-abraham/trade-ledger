// controllers/tradeController.js
const TradeEntry = require('../models/TradeEntry');
const logger = require('../config/logger');
const { Schema } = require('mongoose');
const { getStockPrice } = require('../config/yfinance');

// Get all trade entries
exports.getAllTrades = async (req, res) => {
    try {
        const userId = req.user._id; // Get the logged-in user's ID from req.user

        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Filtering parameters
        const { startDate, endDate, symbol } = req.query;
        const filter = { user: userId };

        // Filter by symbol if provided
        if (symbol) {
            filter.stockSymbol = symbol;
        }

        // Filter by date range if provided
        if (startDate || endDate) {
            filter.tradeDate = {};
            if (startDate) {
                filter.tradeDate.$gte = new Date(startDate);
            }
            if (endDate) {
                filter.tradeDate.$lte = new Date(endDate);
            }
        }

        // Query with filters, pagination, and populate user email
        const trades = await TradeEntry.find(filter)
            .skip(skip)
            .limit(limit);

        // Count total documents for pagination metadata
        const totalTrades = await TradeEntry.countDocuments(filter);

        logger.info('Fetched trade entries with pagination and filtering');

        res.status(200).json({
            total: totalTrades,
            page,
            limit,
            totalPages: Math.ceil(totalTrades / limit),
            trades,
        });
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
        const userId = req.user._id;
        const { stockSymbol, transactionType, quantity, price, tradeDate } = req.body;

        // Step 1: Check user's current holdings for the specified stock
        const currentHoldings = await TradeEntry.aggregate([
            { $match: { user: userId, stockSymbol } },
            {
                $group: {
                    _id: "$stockSymbol",
                    totalQuantity: {
                        $sum: {
                            $cond: [
                                { $eq: ["$transactionType", "Buy"] },
                                "$quantity",
                                { $multiply: ["$quantity", -1] }  // Subtract quantity for "Sell" trades
                            ]
                        }
                    }
                }
            }
        ]);

        const holdings = currentHoldings.length > 0 ? currentHoldings[0].totalQuantity : 0;

        // Step 2: Validate if it's a "Sell" transaction
        if (transactionType === 'Sell' && quantity > holdings) {
            return res.status(400).json({
                error: `Insufficient holdings. You currently possess ${holdings} shares of ${stockSymbol}, but attempted to sell ${quantity}.`
            });
        }

        // Step 3: Create the trade entry if the validation passes
        const newTrade = new TradeEntry({
            user: userId,
            stockSymbol,
            transactionType,
            quantity,
            price,
            tradeDate,
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

exports.getCurrentHoldings = async (req, res) => {
    try {
        const userId = req.user._id;
        const groupedTrades = await TradeEntry.aggregate([
            { $match: { user: userId } }, // Filter trades by the current user
            {
                $group: {
                    _id: "$stockSymbol",
                    totalQuantity: {
                        $sum: {
                            $cond: [
                                { $eq: ["$transactionType", "Buy"] },
                                "$quantity",
                                { $multiply: ["$quantity", -1] }  // Subtract quantity for "Sell" trades
                            ]
                        }
                    },
                    weightedPriceSum: {
                        $sum: {
                            $cond: [
                                { $eq: ["$transactionType", "Buy"] },
                                { $multiply: ["$quantity", "$price"] },
                                0  // Ignore price contribution for "Sell" trades
                            ]
                        }
                    },
                    totalBuyQuantity: {
                        $sum: {
                            $cond: [
                                { $eq: ["$transactionType", "Buy"] },
                                "$quantity",
                                0
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    stockSymbol: "$_id",
                    totalQuantity: 1,
                    averagePrice: {
                        $cond: {
                            if: { $eq: ["$totalBuyQuantity", 0] },
                            then: 0,
                            else: { $divide: ["$weightedPriceSum", "$totalBuyQuantity"] }
                        }
                    }
                }
            }
        ]);

        logger.info(`Fetched grouped trade data for user ${userId}`);
        res.status(200).json(groupedTrades);

    } catch (error) {
        logger.error('Error generating stock report:', error);
        res.status(500).json({ error: 'Error generating stock report' });
    }
}

exports.getPnLReport = async (req, res) => {
    try {
        const userId = req.user._id;

        // Step 1: Aggregate holdings to get net quantity and average purchase price
        const holdings = await TradeEntry.aggregate([
            { $match: { user: userId } },
            {
                $group: {
                    _id: "$stockSymbol",
                    totalQuantity: {
                        $sum: {
                            $cond: [
                                { $eq: ["$transactionType", "Buy"] },
                                "$quantity",
                                { $multiply: ["$quantity", -1] }  // Subtract quantity for "Sell" trades
                            ]
                        }
                    },
                    weightedPriceSum: {
                        $sum: {
                            $cond: [
                                { $eq: ["$transactionType", "Buy"] },
                                { $multiply: ["$quantity", "$price"] },
                                0  // Ignore price contribution for "Sell" trades
                            ]
                        }
                    },
                    totalBuyQuantity: {
                        $sum: {
                            $cond: [
                                { $eq: ["$transactionType", "Buy"] },
                                "$quantity",
                                0
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    stockSymbol: "$_id",
                    totalQuantity: 1,
                    averagePurchasePrice: {
                        $cond: {
                            if: { $eq: ["$totalBuyQuantity", 0] },
                            then: 0,
                            else: { $divide: ["$weightedPriceSum", "$totalBuyQuantity"] }
                        }
                    }
                }
            }
        ]);

        // Step 2: Calculate P&L and percentage change by fetching the current market price for each stock symbol
        const pnlReport = await Promise.all(
            holdings.map(async (holding) => {
                const { stockSymbol, totalQuantity, averagePurchasePrice } = holding;

                // Skip symbols with zero quantity
                if (totalQuantity === 0) return null;

                // Fetch current market price using the utility function
                const currentMarketPrice = await getStockPrice(stockSymbol);

                // Calculate P&L
                const pnl = (currentMarketPrice - averagePurchasePrice) * totalQuantity;

                // Calculate P&L Percentage Change
                const pnlPercentageChange = averagePurchasePrice > 0
                    ? ((currentMarketPrice - averagePurchasePrice) / averagePurchasePrice) * 100
                    : 0;

                return {
                    stockSymbol,
                    totalQuantity,
                    averagePurchasePrice,
                    currentMarketPrice,
                    pnl,
                    pnlPercentageChange
                };
            })
        );

        // Filter out null entries (for stocks with zero quantity) and respond with P&L report
        res.status(200).json(pnlReport.filter(entry => entry !== null));
    } catch (error) {
        logger.error('Error generating P&L report:', error);
        res.status(500).json({ error: 'Error generating P&L report' });
    }
};

// Calculate the total invested amount for the authenticated user
exports.getTotalInvestedAmount = async (req, res) => {
    try {
        const userId = req.user._id;

        // Aggregate total invested amount from "Buy" trades only
        const holdings = await TradeEntry.aggregate([
            { $match: { user: userId } },
            {
                $group: {
                    _id: "$stockSymbol",
                    totalQuantity: {
                        $sum: {
                            $cond: [
                                { $eq: ["$transactionType", "Buy"] },
                                "$quantity",
                                { $multiply: ["$quantity", -1] } // Subtract quantity for "Sell" trades
                            ]
                        }
                    },
                    weightedPriceSum: {
                        $sum: {
                            $cond: [
                                { $eq: ["$transactionType", "Buy"] },
                                { $multiply: ["$quantity", "$price"] },
                                0 // Ignore price contribution for "Sell" trades
                            ]
                        }
                    },
                    totalBuyQuantity: {
                        $sum: {
                            $cond: [
                                { $eq: ["$transactionType", "Buy"] },
                                "$quantity",
                                0
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    stockSymbol: "$_id",
                    totalQuantity: 1,
                    averagePurchasePrice: {
                        $cond: {
                            if: { $eq: ["$totalBuyQuantity", 0] },
                            then: 0,
                            else: { $divide: ["$weightedPriceSum", "$totalBuyQuantity"] }
                        }
                    }
                }
            }
        ]);

        // Extract total invested amount or default to 0 if no data
        const totalInvested = holdings.reduce((sum, holding) => {
            return sum + (holding.averagePurchasePrice * holding.totalQuantity);
        }, 0);

        logger.info(`Calculated total invested amount for user ${userId}`);
        res.status(200).json({ totalInvested });
    } catch (error) {
        logger.error('Error calculating total invested amount:', error);
        res.status(500).json({ error: 'Error calculating total invested amount' });
    }
};

// Calculate total P&L for the authenticated user
exports.getTotalPnL = async (req, res) => {
    try {
        const userId = req.user._id;

        // Step 1: Aggregate holdings to get net quantity and average purchase price for each stock symbol
        const holdings = await TradeEntry.aggregate([
            { $match: { user: userId } },
            {
                $group: {
                    _id: "$stockSymbol",
                    totalQuantity: {
                        $sum: {
                            $cond: [
                                { $eq: ["$transactionType", "Buy"] },
                                "$quantity",
                                { $multiply: ["$quantity", -1] } // Subtract quantity for "Sell" trades
                            ]
                        }
                    },
                    weightedPriceSum: {
                        $sum: {
                            $cond: [
                                { $eq: ["$transactionType", "Buy"] },
                                { $multiply: ["$quantity", "$price"] },
                                0 // Ignore price contribution for "Sell" trades
                            ]
                        }
                    },
                    totalBuyQuantity: {
                        $sum: {
                            $cond: [
                                { $eq: ["$transactionType", "Buy"] },
                                "$quantity",
                                0
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    stockSymbol: "$_id",
                    totalQuantity: 1,
                    averagePurchasePrice: {
                        $cond: {
                            if: { $eq: ["$totalBuyQuantity", 0] },
                            then: 0,
                            else: { $divide: ["$weightedPriceSum", "$totalBuyQuantity"] }
                        }
                    }
                }
            }
        ]);

        // Step 2: Calculate total P&L by fetching the current market price for each stock symbol
        let totalPnL = 0;

        for (const holding of holdings) {
            const { stockSymbol, totalQuantity, averagePurchasePrice } = holding;

            // Skip symbols with zero quantity
            if (totalQuantity === 0) continue;

            // Fetch current market price using the utility function
            const currentMarketPrice = await getStockPrice(stockSymbol);

            // Calculate P&L for this stock
            const pnl = (currentMarketPrice - averagePurchasePrice) * totalQuantity;

            // Add this P&L to the total P&L
            totalPnL += pnl;
        }

        logger.info(`Calculated total P&L for user ${userId}`);
        res.status(200).json({ totalPnL });
    } catch (error) {
        logger.error('Error calculating total P&L:', error);
        res.status(500).json({ error: 'Error calculating total P&L' });
    }
};



// Calculate total percentage change for the current investment
exports.getTotalPercentageChange = async (req, res) => {
    try {
        const userId = req.user._id;

        // Step 1: Aggregate holdings to get net quantity and average purchase price for each stock symbol
        const holdings = await TradeEntry.aggregate([
            { $match: { user: userId } },
            {
                $group: {
                    _id: "$stockSymbol",
                    totalQuantity: {
                        $sum: {
                            $cond: [
                                { $eq: ["$transactionType", "Buy"] },
                                "$quantity",
                                { $multiply: ["$quantity", -1] } // Subtract quantity for "Sell" trades
                            ]
                        }
                    },
                    weightedPriceSum: {
                        $sum: {
                            $cond: [
                                { $eq: ["$transactionType", "Buy"] },
                                { $multiply: ["$quantity", "$price"] },
                                0 // Ignore price contribution for "Sell" trades
                            ]
                        }
                    },
                    totalBuyQuantity: {
                        $sum: {
                            $cond: [
                                { $eq: ["$transactionType", "Buy"] },
                                "$quantity",
                                0
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    stockSymbol: "$_id",
                    totalQuantity: 1,
                    averagePurchasePrice: {
                        $cond: {
                            if: { $eq: ["$totalBuyQuantity", 0] },
                            then: 0,
                            else: { $divide: ["$weightedPriceSum", "$totalBuyQuantity"] }
                        }
                    }
                }
            }
        ]);

        // Step 2: Calculate total invested amount and current market value
        let totalInvestedAmount = 0;
        let currentMarketValue = 0;

        for (const holding of holdings) {
            const { stockSymbol, totalQuantity, averagePurchasePrice } = holding;

            // Skip symbols with zero quantity
            if (totalQuantity === 0) continue;

            // Calculate invested amount for this stock
            totalInvestedAmount += averagePurchasePrice * totalQuantity;

            // Fetch current market price and calculate current value
            const currentMarketPrice = await getStockPrice(stockSymbol);
            currentMarketValue += currentMarketPrice * totalQuantity;
        }

        // Step 3: Calculate percentage change
        const percentageChange = totalInvestedAmount > 0
            ? ((currentMarketValue - totalInvestedAmount) / totalInvestedAmount) * 100
            : 0;

        logger.info(`Calculated total percentage change for user ${userId}`);
        res.status(200).json({ totalInvestedAmount, currentMarketValue, percentageChange });
    } catch (error) {
        logger.error('Error calculating total percentage change:', error);
        res.status(500).json({ error: 'Error calculating total percentage change' });
    }
};
