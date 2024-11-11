// models/TradeEntry.js
const mongoose = require('mongoose');

const tradeEntrySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to User model
    stockSymbol: { type: String, required: true },
    transactionType: { type: String, enum: ['Buy', 'Sell'], required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    tradeDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
});

module.exports = mongoose.model('TradeEntry', tradeEntrySchema);
