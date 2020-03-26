const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');

// Protect routes -- authenticate
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // set token from auth header
    token = req.headers.authorization.split(' ')[1];
  } else if (
    process.env.USE_COOKIE &&
    process.env.USE_COOKIE.toLowerCase() === 'true' &&
    req.cookies.token
  ) {
    // Set token from cookie
    token = req.cookies.token;
  }

  // if token doesn't exist
  if (!token) {
    return next(new ErrorResponse('Unauthorized access', 401));
  }

  // Verify token, set user in current request and continue execution
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    return next(new ErrorResponse('Unauthorized access', 401));
  }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
