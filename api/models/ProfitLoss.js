// models/ProfitLoss.js
const mongoose = require('mongoose');

const profitLossSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    stockSymbol: { type: String, required: true },
    sellTradeId: { type: mongoose.Schema.Types.ObjectId, ref: 'TradeEntry', required: true },
    sellDate: { type: Date, required: true },
    sellPrice: { type: Number, required: true },
    sellQuantity: { type: Number, required: true },
    averagePurchasePrice: { type: Number, required: true },
    profitOrLoss: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ProfitLoss', profitLossSchema);
