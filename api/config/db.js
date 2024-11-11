// config/db.js
const mongoose = require('mongoose');
const logger = require('./logger')

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/tradeLedger', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('MongoDB connected successfully');
  } catch (err) {
    logger.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
