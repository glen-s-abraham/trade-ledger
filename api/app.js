// app.js
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const tradeRoutes = require('./routes/trades');
const setupSwagger = require('./config/swagger');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Swagger Documentation
setupSwagger(app);

// Routes
app.use('/api/trades', tradeRoutes);

module.exports = app;
