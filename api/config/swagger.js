// config/swagger.js

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Trade Ledger API',
      version: '1.0.0',
      description: 'API documentation for the Trade Ledger Application',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server'
      }
    ],
  },
  apis: ['./routes/*.js'], // Pointing to route files for Swagger annotations
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
