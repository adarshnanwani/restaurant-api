const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error on console
  console.log(err);

  // Handle Bad ObjectID error
  if (err.name === 'CaseError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404); // 404 - Not found error
  }

  // Handle Duplicate key error
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400); // 400 - Client error
  }

  // Handle Validation errors
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(error => error.message);
    error = new ErrorResponse(message, 400); // 400 - Client error
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};

module.exports = errorHandler;
