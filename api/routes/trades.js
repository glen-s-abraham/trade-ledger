const express = require('express');
const TradeEntry = require('../models/TradeEntry');
const validateRequest = require('../middlewares/validateRequest');
const { tradeEntrySchema } = require('../schemas/tradeValidator');

const router = express.Router();

/**
 * @swagger
 * /api/trades:
 *   get:
 *     summary: Get all trade entries
 *     description: Retrieve a list of all trade entries.
 *     tags:
 *       - Trades
 *     responses:
 *       200:
 *         description: Successfully retrieved list of trade entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user:
 *                     type: string
 *                     example: "glen"
 *                   stockSymbol:
 *                     type: string
 *                     example: "AAPL"
 *                   transactionType:
 *                     type: string
 *                     example: "Buy"
 *                   quantity:
 *                     type: number
 *                     example: 10
 *                   price:
 *                     type: number
 *                     example: 150.00
 *                   tradeDate:
 *                     type: string
 *                     example: "2024-11-11"
 */
router.get('/', async (req, res) => {
    const trades = await TradeEntry.find();
    res.status(200).json(trades);
});

/**
 * @swagger
 * /api/trades/{id}:
 *   get:
 *     summary: Get a trade entry by ID
 *     tags:
 *       - Trades
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The trade entry ID
 *     responses:
 *       200:
 *         description: Trade entry found
 *       404:
 *         description: Trade entry not found
 */
router.get('/:id', async (req, res) => {
    try {
        const trade = await TradeEntry.findById(req.params.id);
        if (!trade) return res.status(404).json({ message: 'Trade entry not found' });
        res.status(200).json(trade);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/trades:
 *   post:
 *     summary: Create a new trade entry
 *     tags: 
 *      - Trades
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 example: "glen"
 *               stockSymbol:
 *                 type: string
 *                 example: "aapl"
 *               transactionType:
 *                 type: string
 *                 enum: [Buy, Sell]
 *                 example: "Buy"
 *               quantity:
 *                 type: number
 *                 example: 10
 *               price:
 *                 type: number
 *                 example: 150.00
 *               tradeDate:
 *                 type: string
 *                 example: "2024-11-11"
 *     responses:
 *       201:
 *         description: Created trade entry
 *       400:
 *         description: Validation error
 */
router.post('/', validateRequest(tradeEntrySchema), async (req, res) => {
    try {
        const newTrade = new TradeEntry(req.body);
        const savedTrade = await newTrade.save();
        res.status(201).json(savedTrade);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/trades/{id}:
 *   put:
 *     summary: Update a trade entry by ID
 *     tags:
 *       - Trades
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The trade entry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 example: "glen"
 *               stockSymbol:
 *                 type: string
 *                 example: "aapl"
 *               transactionType:
 *                 type: string
 *                 enum: [Buy, Sell]
 *                 example: "Buy"
 *               quantity:
 *                 type: number
 *                 example: 10
 *               price:
 *                 type: number
 *                 example: 150.00
 *               tradeDate:
 *                 type: string
 *                 example: "2024-11-11"
 *     responses:
 *       200:
 *         description: Updated trade entry
 *       404:
 *         description: Trade entry not found
 */
router.put('/:id', validateRequest(tradeEntrySchema), async (req, res) => {
    try {
        const updatedTrade = await TradeEntry.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTrade) return res.status(404).json({ message: 'Trade entry not found' });
        res.status(200).json(updatedTrade);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/trades/{id}:
 *   delete:
 *     summary: Delete a trade entry by ID
 *     tags:
 *       - Trades
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The trade entry ID
 *     responses:
 *       200:
 *         description: Trade entry deleted
 *       404:
 *         description: Trade entry not found
 */
router.delete('/:id', async (req, res) => {
    try {
        const deletedTrade = await TradeEntry.findByIdAndDelete(req.params.id);
        if (!deletedTrade) return res.status(404).json({ message: 'Trade entry not found' });
        res.status(200).json({ message: 'Trade entry deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
