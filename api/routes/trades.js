// routes/trades.js
const express = require('express');
const tradeController = require('../controllers/tradeController');
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
 */
router.get('/', tradeController.getAllTrades);

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
router.get('/:id', tradeController.getTradeById);

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
router.post('/', validateRequest(tradeEntrySchema), tradeController.createTrade);

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
router.put('/:id', validateRequest(tradeEntrySchema), tradeController.updateTrade);

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
router.delete('/:id', tradeController.deleteTrade);


/**
 * @swagger
 * /api/trades/current/holdings:
 *   get:
 *     summary: Get current holdings for the authenticated user
 *     description: Returns a list of the user's current holdings, including total quantity and average purchase price per stock symbol.
 *     tags:
 *       - Trades
 *     security:
 *       - bearerAuth: []  # Requires a JWT token
 *     responses:
 *       200:
 *         description: List of current holdings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   stockSymbol:
 *                     type: string
 *                     description: The stock symbol
 *                     example: "AAPL"
 *                   totalQuantity:
 *                     type: number
 *                     description: Net quantity of shares held after considering Buy and Sell trades
 *                     example: 30
 *                   averagePrice:
 *                     type: number
 *                     description: Weighted average purchase price based on Buy trades only
 *                     example: 145.75
 *       500:
 *         description: Internal server error
 */

router.get('/current/holdings', tradeController.getCurrentHoldings);

module.exports = router;
