const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

//@desc     Get all restaurants
//@route    GET /api/v1/restaurants
//@access   Public
exports.getAllRestaurants = asyncHandler(async (req, res, next) => {
  const restaurants = await User.find({ isRestaurant: true });
  res.status(200).json({
    success: true,
    count: restaurants.length,
    data: restaurants
  });
});
