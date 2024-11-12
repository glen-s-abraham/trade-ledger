const TradeEntry = require('../models/TradeEntry');

async function getAveragePurchasePrice(userId, stockSymbol) {
    const result = await TradeEntry.aggregate([
        { $match: { user: userId, stockSymbol, transactionType: 'Buy' } },
        {
            $group: {
                _id: null,
                totalQuantity: { $sum: "$quantity" },
                totalAmount: { $sum: { $multiply: ["$quantity", "$price"] } }
            }
        },
        {
            $project: {
                averagePrice: { $divide: ["$totalAmount", "$totalQuantity"] }
            }
        }
    ]);

    return result.length > 0 ? result[0].averagePrice : 0;
}

module.exports = getAveragePurchasePrice;