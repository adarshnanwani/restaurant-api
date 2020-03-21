const User = require('../models/User');
const crypto = require('crypto');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

//@desc     Register User
//@route    POST api/v1/auth/register
//@access   Public
exports.registerUser = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.create({
    username,
    password
  });

  sendTokenResponse(user, 200, res);
});

//@desc     Login user
//@route    POST api/v1/auth/login
//@access   Public
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  // Check if email and password are submitted
  if (!username || !password) {
    return next(
      new ErrorResponse('Please enter both username and password', 400)
    );
  }

  // Check if user exists
  const user = await User.findOne({ username }).select('+password');
  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  console.log('USER', user);

  // Check if password matches
  const passwordMatches = await user.comparePassword(password);
  if (!passwordMatches) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // If everything goes well
  sendTokenResponse(user, 200, res);
});

//@desc     Get currently logged in user
//@route    POST api/v1/auth/me
//@access   Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({ success: true, data: user });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token });
};
