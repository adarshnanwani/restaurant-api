const Order = require('../models/Order');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

//@desc     Create a new order
//@route    POST /api/v1/orders/:restaurantId
//@access   Private (Only a customer user can create an order)
exports.createOrder = asyncHandler(async (req, res, next) => {
  // Check if user is a restaurant user
  if (req.user.isRestaurant) {
    return next(
      new ErrorResponse('User not authorized to place an order', 401)
    );
  }

  if (!req.params.restaurantId) {
    return next(new ErrorResponse('Restaurant Id is required', 400));
  }

  // Tag order to restaurant and user
  req.body.restaurant = req.params.restaurantId;
  req.body.user = req.user.id;

  const order = await Order.create(req.body);

  res.status(201).json({ success: true, data: order });
});
