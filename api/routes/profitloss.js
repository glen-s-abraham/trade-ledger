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

module.exports = router;
