// t-ledger-api/utils/logger.js
const { createLogger, format, transports } = require('winston');
const path = require('path');

// Define log format
const logFormat = format.printf(({ timestamp, level, message }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Initialize logger
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
    logFormat
  ),
  transports: [
    // Console log
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
      ),
    }),
    // File log for errors
    new transports.File({ filename: path.join(__dirname, '../logs/error.log'), level: 'error' }),
    // General log file
    new transports.File({ filename: path.join(__dirname, '../logs/combined.log') }),
  ],
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (ex) => {
  logger.error('An unhandled rejection occurred:', ex);
});

// Handle uncaught exceptions
process.on('uncaughtException', (ex) => {
  logger.error('An uncaught exception occurred:', ex);
});

module.exports = logger;
