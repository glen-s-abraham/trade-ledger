const ExcelJS = require('exceljs');
const ProfitLoss = require('../models/ProfitLoss');
const TradeEntry = require('../models/TradeEntry');
const logger = require('../config/logger');
const { isValidDate } = require('../utils/validation');

exports.generateExcelReport = async (req, res) => {
    try {
        const { reportType, startDate, endDate } = req.query;
        const userId = req.user._id;

        // Validate `reportType`
        const validReportTypes = ['cumulative-pnl', 'symbol-wise-pnl', 'trade-history'];
        if (!validReportTypes.includes(reportType)) {
            return res.status(400).json({ error: 'Invalid report type specified.' });
        }

        // Validate and parse `startDate` and `endDate`
        const dateFilter = {};
        if (startDate) {
            if (!isValidDate(startDate)) {
                return res.status(400).json({ error: 'Invalid startDate format. Use YYYY-MM-DD.' });
            }
            dateFilter.$gte = new Date(startDate);
        }
        if (endDate) {
            if (!isValidDate(endDate)) {
                return res.status(400).json({ error: 'Invalid endDate format. Use YYYY-MM-DD.' });
            }
            dateFilter.$lte = new Date(endDate);
        }

        // Fetch data based on report type
        let data = [];
        let totalPnL = 0; // Initialize total P&L for cumulative calculation

        try {
            if (reportType === 'cumulative-pnl') {
                const dateFormat = { $dateToString: { format: "%Y-%m-%d", date: "$sellDate" } };
                data = await ProfitLoss.aggregate([
                    { $match: { user: userId, ...(startDate || endDate ? { sellDate: dateFilter } : {}) } },
                    {
                        $group: {
                            _id: dateFormat,
                            totalProfitOrLoss: { $sum: "$profitOrLoss" }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            date: "$_id",
                            totalProfitOrLoss: 1
                        }
                    },
                    { $sort: { date: 1 } } // Sort by date in ascending order
                ]);
                totalPnL = data.reduce((sum, item) => sum + (item.totalProfitOrLoss || 0), 0);

            } else if (reportType === 'symbol-wise-pnl') {
                data = await ProfitLoss.aggregate([
                    { $match: { user: userId, ...(startDate || endDate ? { sellDate: dateFilter } : {}) } },
                    {
                        $group: {
                            _id: "$stockSymbol",
                            totalProfitOrLoss: { $sum: "$profitOrLoss" },
                        }
                    },
                    {
                        $project: {
                            stockSymbol: "$_id",
                            totalProfitOrLoss: 1,
                            _id: 0,
                        }
                    }
                ]);
                totalPnL = data.reduce((sum, item) => sum + (item.totalProfitOrLoss || 0), 0);

            } else if (reportType === 'trade-history') {
                data = await TradeEntry.find({
                    user: userId,
                    ...(startDate || endDate ? { tradeDate: dateFilter } : {})
                }).lean(); // Use .lean() for better memory efficiency
            }
        } catch (error) {
            logger.error('Error fetching data from database:', error);
            return res.status(500).json({ error: 'Error fetching report data' });
        }

        // Initialize Excel workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(`${reportType}-Report`);

        // Define columns based on report type
        if (reportType === 'cumulative-pnl') {
            worksheet.columns = [
                { header: 'Date', key: 'date', width: 15 },
                { header: 'Profit or Loss', key: 'totalProfitOrLoss', width: 20 }
            ];

            // Add data rows for cumulative P&L
            data.forEach((item) => worksheet.addRow(item));

            // Add a total row
            worksheet.addRow({});
            worksheet.addRow({ date: 'Total', totalProfitOrLoss: totalPnL });

            // Format the total row with bold font
            const lastRow = worksheet.lastRow;
            lastRow.font = { bold: true };
            lastRow.getCell('totalProfitOrLoss').numFmt = '₹#,##0.00;[Red]($#,##0.00)';

        } else if (reportType === 'symbol-wise-pnl') {
            worksheet.columns = [
                { header: 'Stock Symbol', key: 'stockSymbol', width: 20 },
                { header: 'Total Profit or Loss', key: 'totalProfitOrLoss', width: 20 }
            ];

            // Add data rows for symbol-wise P&L
            data.forEach((item) => worksheet.addRow(item));

            // Add a total row for net P&L across all symbols
            worksheet.addRow({});
            worksheet.addRow({ stockSymbol: 'Total', totalProfitOrLoss: totalPnL });

            // Format the total row with bold font
            const lastRow = worksheet.lastRow;
            lastRow.font = { bold: true };
            lastRow.getCell('totalProfitOrLoss').numFmt = '₹#,##0.00;[Red]($#,##0.00)';

        } else if (reportType === 'trade-history') {
            worksheet.columns = [
                { header: 'Stock Symbol', key: 'stockSymbol', width: 20 },
                { header: 'Transaction Type', key: 'transactionType', width: 15 },
                { header: 'Quantity', key: 'quantity', width: 10 },
                { header: 'Price', key: 'price', width: 15 },
                { header: 'Trade Date', key: 'tradeDate', width: 20 }
            ];

            // Add data rows for trade history
            data.forEach((item) => worksheet.addRow(item));
        }

        // Format the header row
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

        // Format cells with currency format (if applicable)
        if (reportType === 'cumulative-pnl' || reportType === 'symbol-wise-pnl') {
            worksheet.getColumn('totalProfitOrLoss').numFmt = '₹#,##0.00;[Red]($#,##0.00)';
        } else if (reportType === 'trade-history') {
            worksheet.getColumn('price').numFmt = '₹#,##0.00;[Red]($#,##0.00)';
            worksheet.getColumn('tradeDate').numFmt = 'yyyy-mm-dd';
        }

        // Set headers and send the Excel file as response
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${reportType}-report.xlsx`);

        // Write workbook to response
        await workbook.xlsx.write(res);
        res.end();

        logger.info(`Generated ${reportType} report as Excel for user ${userId}`);
    } catch (error) {
        logger.error('Error generating Excel report:', error);
        res.status(500).json({ error: 'Error generating Excel report' });
    }
};
