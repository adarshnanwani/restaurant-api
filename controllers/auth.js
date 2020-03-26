const User = require('../models/User');
const crypto = require('crypto');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');

//@desc     Register User
//@route    POST api/v1/auth/register
//@access   Public
exports.registerUser = asyncHandler(async (req, res, next) => {
  const {
    userName,
    userEmail,
    userPassword,
    isRestaurant,
    userGender,
    userAge,
    userCity,
    userCountry,
    userProfileImageUrl,
    typeOfFood
  } = req.body;

  const user = new User({
    userName,
    userEmail,
    userPassword,
    isRestaurant,
    userCity,
    userCountry,
    userProfileImageUrl
  });
  if (typeOfFood) {
    user.typeOfFood = typeOfFood;
  }
  if (userGender) {
    user.userGender = userGender;
  }
  if (userAge) {
    user.userAge = userAge;
  }

  await user.save();

  sendTokenResponse(user, 200, res);
});

//@desc     Login user
//@route    POST api/v1/auth/login
//@access   Public
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are submitted
  if (!email || !password) {
    return next(new ErrorResponse('Please enter both email and password', 400));
  }

  // Check if user exists
  const user = await User.findOne({ email }).select('+password');
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

// @desc      Update user details
// @route     PUT /api/v1/users
// @access    Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

//@desc     Forgot password
//@route    POST api/v1/auth/forgotpassword
//@access   Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password.
   Please make a PUT request to \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message
    });
    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (err) {
    console.log(err);
    user.getResetPasswordToken = undefined;
    user.getResetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

//@desc     Reset password
//@route    PUT api/v1/auth/resetpassword/:resetToken
//@access   Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed password
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {
      $gt: Date.now()
    }
  });

  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }

  // Set new password
  user.password = req.body.password;
  // Reset the reset password fields
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendTokenResponse(user, 200, res);
});

//@desc     Update password for the user
//@route    PUT api/v1/auth/changepassword
//@access   Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check if user exists
  if (!user) {
    return next(
      new ErrorResponse(`No user found with the id ${req.user.id}`, 404)
    );
  }

  // Check current password
  if (!(await user.comparePassword(req.body.currentPassword))) {
    return next(new ErrorResponse(`Password is incorrect.`, 401));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendTokenResponse(user, 200, res);
});

//@desc     Log user out / clear cookie
//@route    GET api/v1/auth/logout
//@access   Private
exports.logout = asyncHandler(async (req, res, next) => {
  if (
    process.env.USE_COOKIE &&
    process.env.USE_COOKIE.toLowerCase() === 'true'
  ) {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });
  }
  res.status(200).json({ success: true, data: {} });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  if (
    process.env.USE_COOKIE &&
    process.env.USE_COOKIE.toLowerCase() === 'true'
  ) {
    const options = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') {
      options.secure = true;
    }
    res.cookie('token', token, options);
  }

  res.status(statusCode).json({ success: true, token });
};
