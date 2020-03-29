var swaggerUi = require('swagger-ui-express');
var swaggerJSDoc = require('swagger-jsdoc');

var options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Restaurant App', // Title (required)
      version: '1.0.0', // Version (required)
      description:
        'An API that allows you to add restaurants and customers, manage menu items, and place and track orders.'
    }
  },
  apis: ['./models/*.js', './routes/api/*.js'] // Path to the API docs / absolute path
};
var swaggerSpec = swaggerJSDoc(options);

module.exports = app => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
