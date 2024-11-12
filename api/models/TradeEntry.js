// models/TradeEntry.js
const mongoose = require('mongoose');
const ProfitLoss = require('./ProfitLoss')


const tradeEntrySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to User model
    stockSymbol: { type: String, required: true },
    transactionType: { type: String, enum: ['Buy', 'Sell'], required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    tradeDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
});

async function getAveragePurchasePrice(userId, stockSymbol) {
    const result = await mongoose.model('TradeEntry', tradeEntrySchema).aggregate([
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

// Post-save middleware to create a ProfitLoss entry for "Sell" trades
tradeEntrySchema.post('save', async function (doc, next) {
    if (doc.transactionType === 'Sell') {
        try {
            const averagePurchasePrice = await getAveragePurchasePrice(doc.user, doc.stockSymbol);
            const profitOrLoss = (doc.price - averagePurchasePrice) * doc.quantity;

            // Attempt to create the ProfitLoss entry
            const profitLossRecord = new ProfitLoss({
                user: doc.user,
                stockSymbol: doc.stockSymbol,
                sellTradeId: doc._id,
                sellDate: doc.tradeDate,
                sellPrice: doc.price,
                sellQuantity: doc.quantity,
                averagePurchasePrice,
                profitOrLoss
            });
            await profitLossRecord.save();

            next(); // Move to the next middleware
        } catch (error) {
            console.error('Error creating ProfitLoss entry:', error);

            // Rollback: Delete the TradeEntry if ProfitLoss creation fails
            await mongoose.model('TradeEntry').deleteOne({ _id: doc._id });

            // Pass an error to halt further processing
            next(new Error('Failed to create ProfitLoss entry, TradeEntry has been rolled back'));
        }
    } else {
        next();
    }
});
// Post-remove middleware to delete the ProfitLoss entry associated with the "Sell" trade
tradeEntrySchema.pre('findOneAndDelete', async function (next) {
    try {
        // Fetch the document that matches the deletion criteria
        const trade = await this.model.findOne(this.getFilter());

        // If the trade exists and is a "Sell" trade, delete associated ProfitLoss entry
        if (trade && trade.transactionType === 'Sell') {
            const result = await ProfitLoss.deleteOne({ sellTradeId: trade._id });

            // Check if the ProfitLoss entry was actually deleted
            if (result.deletedCount === 0) {
                throw new Error('ProfitLoss entry not found or could not be deleted');
            }
        }

        next(); // Proceed with the TradeEntry deletion
    } catch (error) {
        console.error('Error deleting ProfitLoss entry:', error);

        // Pass an error to next() to prevent TradeEntry deletion
        next(new Error('Failed to delete ProfitLoss entry, TradeEntry deletion has been aborted'));
    }
});

module.exports = mongoose.model('TradeEntry', tradeEntrySchema);
