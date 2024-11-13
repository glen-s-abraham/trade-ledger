const express = require('express');
const passport = require('passport');
const reportController = require('../controllers/reportController');

const router = express.Router();

/**
 * @swagger
 * /api/reports/csv:
 *   get:
 *     summary: Generate CSV report
 *     description: Generate a CSV report for various trading and profit/loss data.
 *     tags:
 *       - Reports
 *     security:
 *       - bearerAuth: []  # Requires a JWT token
 *     parameters:
 *       - in: query
 *         name: reportType
 *         schema:
 *           type: string
 *           enum: [cumulative-pnl, symbol-wise-pnl, trade-history]
 *           required: true
 *         description: Type of report to generate (e.g., cumulative-pnl, symbol-wise-pnl, trade-history)
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering the report
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering the report
 *     responses:
 *       200:
 *         description: CSV report generated successfully
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.get('/csv', reportController.generateExcelReport);

module.exports = router;
