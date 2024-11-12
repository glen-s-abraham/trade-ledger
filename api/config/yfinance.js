const logger = require('./logger')
const yahooFinance = require('yahoo-finance2').default;

async function getStockPrice(symbol) {
    try {
        const quote = await yahooFinance.quote(symbol);
        logger.info('Successfully fetched market data.');
        return quote.regularMarketPrice || 0
    } catch (err) {
        logger.error(err.message);
        return 0
    }

}

async function validateStockSymbol(symbol) {
    try {
        const quote = await yahooFinance.quote(symbol);
        return !!quote; // Returns true if the symbol is valid
    } catch (error) {
        logger.error(`Invalid stock symbol ${symbol}:`, error.message);
        return false; // Returns false if the symbol is invalid or not found
    }
}

module.exports = {
    getStockPrice,
    validateStockSymbol
}
