// app.js
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const tradeRoutes = require('./routes/trades');
const authRoutes = require('./routes/auth');
const setupSwagger = require('./config/swagger');
const logger = require('./config/logger');
const passport = require('passport');
require('./config/passport');


const app = express();

// Connect to database and log connection status
connectDB()


// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());

// Swagger Documentation
setupSwagger(app);

// Routes
app.use('/api/trades', passport.authenticate('jwt', { session: false }), tradeRoutes);
app.use('/api/auth', authRoutes);

// Error-handling middleware
app.use((err, req, res, next) => {
    logger.error(`Error occurred: ${err.message}`, err);
    res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
