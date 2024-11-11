// server.js
const app = require('./app');
const logger = require('./config/logger')

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
  logger.info(`API Documentation is available at http://localhost:${PORT}/api-docs`);
});
