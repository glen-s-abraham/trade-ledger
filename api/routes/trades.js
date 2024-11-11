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

/**
 * @swagger
 * /api/trades/current/pnl:
 *   get:
 *     summary: Get the profit and loss (P&L) report for the user's holdings
 *     description: Returns the P&L report for each stock symbol the user holds, including current market price, total quantity, and average purchase price.
 *     tags:
 *       - Trades
 *     security:
 *       - bearerAuth: []  # Requires a JWT token
 *     responses:
 *       200:
 *         description: P&L report for the user's holdings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   stockSymbol:
 *                     type: string
 *                     example: "AAPL"
 *                   totalQuantity:
 *                     type: number
 *                     example: 30
 *                   averagePurchasePrice:
 *                     type: number
 *                     example: 150.75
 *                   currentMarketPrice:
 *                     type: number
 *                     example: 175.00
 *                   pnl:
 *                     type: number
 *                     description: Profit or loss based on current market price and average purchase price
 *                     example: 730.5
 *       500:
 *         description: Internal server error
 */

// Route for P&L report
router.get('/current/pnl', tradeController.getPnLReport);

/**
 * @swagger
 * /api/trades/current/invested:
 *   get:
 *     summary: Get the total invested amount for the authenticated user
 *     description: Returns the total invested amount based on all "Buy" trades made by the user.
 *     tags:
 *       - Trades
 *     security:
 *       - bearerAuth: []  # Requires a JWT token
 *     responses:
 *       200:
 *         description: Total invested amount
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalInvested:
 *                   type: number
 *                   description: Total amount invested in "Buy" trades
 *                   example: 50000.75
 *       500:
 *         description: Internal server error
 */

// Route to get total invested amount
router.get(
    '/current/invested',
    tradeController.getTotalInvestedAmount
);

/**
 * @swagger
 * /api/trades/current/total-pnl:
 *   get:
 *     summary: Get the total P&L for the user's holdings
 *     description: Returns the total profit or loss (P&L) across all stocks the user is holding.
 *     tags:
 *       - Trades
 *     security:
 *       - bearerAuth: []  # Requires a JWT token
 *     responses:
 *       200:
 *         description: Total P&L for the user's holdings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPnL:
 *                   type: number
 *                   description: Total profit or loss for all holdings
 *                   example: 5000.75
 *       500:
 *         description: Internal server error
 */

// Route to get total P&L
router.get('/current/total-pnl', tradeController.getTotalPnL);

/**
 * @swagger
 * /api/trades/current/total-percentage-change:
 *   get:
 *     summary: Get the total percentage change for the user's investment
 *     description: Returns the total invested amount, current market value, and percentage change.
 *     tags:
 *       - Trades
 *     security:
 *       - bearerAuth: []  # Requires a JWT token
 *     responses:
 *       200:
 *         description: Total percentage change for the user's investment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalInvestedAmount:
 *                   type: number
 *                   description: Total amount invested in "Buy" trades
 *                   example: 50000.75
 *                 currentMarketValue:
 *                   type: number
 *                   description: Current market value based on latest prices
 *                   example: 55000.00
 *                 percentageChange:
 *                   type: number
 *                   description: Percentage change between current market value and total invested amount
 *                   example: 10.0
 *       500:
 *         description: Internal server error
 */

// Route to get total percentage change for the current investment
router.get('/current/total-percentage-change', tradeController.getTotalPercentageChange);

module.exports = router;

