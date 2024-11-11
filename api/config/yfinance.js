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

module.exports = {
    getStockPrice
}
