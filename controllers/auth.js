const User = require('../models/User');
const crypto = require('crypto');
const asyncHandler = require('../middleware/async');

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
