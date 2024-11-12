// routes/profitloss.js
const express = require('express');
const profitLossController = require('../controllers/profitLossController');

const router = express.Router();

/**
 * @swagger
 * /api/profitloss/summary:
 *   get:
 *     summary: Get cumulative profit or loss statement for the user
 *     description: Returns the cumulative profit or loss for all trades of the authenticated user.
 *     tags:
 *       - ProfitLoss
 *     security:
 *       - bearerAuth: []  # Requires a JWT token
 *     responses:
 *       200:
 *         description: Cumulative profit or loss statement
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalProfitOrLoss:
 *                   type: number
 *                   description: Total profit or loss across all trades
 *                   example: 1234.56
 *       500:
 *         description: Internal server error
 */
router.get('/summary', profitLossController.getCumulativeProfitLoss);

/**
 * @swagger
 * /api/profitloss/symbol-summary:
 *   get:
 *     summary: Get cumulative profit or loss for each symbol
 *     description: Returns the cumulative profit or loss grouped by stock symbol for the authenticated user.
 *     tags:
 *       - ProfitLoss
 *     security:
 *       - bearerAuth: []  # Requires a JWT token
 *     responses:
 *       200:
 *         description: Cumulative profit or loss for each stock symbol
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   stockSymbol:
 *                     type: string
 *                     description: Stock symbol
 *                     example: "AAPL"
 *                   totalProfitOrLoss:
 *                     type: number
 *                     description: Total profit or loss for the symbol
 *                     example: 1234.56
 *       500:
 *         description: Internal server error
 */
router.get('/symbol-summary', profitLossController.getSymbolWiseProfitLoss);

/**
 * @swagger
 * /api/profitloss/date-filtered:
 *   get:
 *     summary: Get cumulative profit or loss within a date range
 *     description: Returns the cumulative profit or loss for all trades within a specified date range.
 *     tags:
 *       - ProfitLoss
 *     security:
 *       - bearerAuth: []  # Requires a JWT token
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter trades from this date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter trades up to this date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Cumulative profit or loss within the date range
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalProfitOrLoss:
 *                   type: number
 *                   description: Total profit or loss for the date range
 *                   example: 1234.56
 *       500:
 *         description: Internal server error
 */
router.get('/date-filtered', profitLossController.getDateFilteredProfitLoss);

/**
 * @swagger
 * /api/profitloss/symbol-summary-date:
 *   get:
 *     summary: Get cumulative profit or loss grouped by symbol within a date range
 *     description: Returns the cumulative profit or loss grouped by stock symbol within a specified date range.
 *     tags:
 *       - ProfitLoss
 *     security:
 *       - bearerAuth: []  # Requires a JWT token
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter trades from this date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter trades up to this date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Cumulative profit or loss for each stock symbol within the date range
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   stockSymbol:
 *                     type: string
 *                     description: Stock symbol
 *                     example: "AAPL"
 *                   totalProfitOrLoss:
 *                     type: number
 *                     description: Total profit or loss for the symbol within the date range
 *                     example: 1234.56
 *       500:
 *         description: Internal server error
 */
router.get('/symbol-summary-date',  profitLossController.getSymbolWiseDateFilteredProfitLoss);

module.exports = router;
