// validators/tradeValidator.js
const Joi = require('joi');

const tradeEntrySchema = Joi.object({
  user: Joi.string().required().messages({
    'string.empty': 'User is required',
  }),
  stockSymbol: Joi.string().required().messages({
    'string.empty': 'Stock symbol is required',
  }),
  transactionType: Joi.string().valid('Buy', 'Sell').required().messages({
    'any.only': 'Transaction type must be either Buy or Sell',
  }),
  quantity: Joi.number().positive().required().messages({
    'number.base': 'Quantity must be a number',
    'number.positive': 'Quantity must be a positive number',
  }),
  price: Joi.number().positive().required().messages({
    'number.base': 'Price must be a number',
    'number.positive': 'Price must be a positive number',
  }),
  tradeDate: Joi.date().required().messages({
    'date.base': 'Trade date must be a valid date',
  }),
});

module.exports = {
  tradeEntrySchema,
};
