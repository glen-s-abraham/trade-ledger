// app.js
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const tradeRoutes = require('./routes/trades');
const setupSwagger = require('./config/swagger');
const logger = require('./config/logger');

const app = express();

// Connect to database and log connection status
connectDB()


// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Swagger Documentation
setupSwagger(app);

// Routes
app.use('/api/trades', tradeRoutes);

// Error-handling middleware
app.use((err, req, res, next) => {
    logger.error(`Error occurred: ${err.message}`, err);
    res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
