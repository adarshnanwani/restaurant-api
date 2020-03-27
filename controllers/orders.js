const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

//@desc     Get all orders for a restaurant
//@route    GET /api/v1/orders
//@access   Private (Only a customer user can create an order)
exports.getAllOrders = asyncHandler(async (req, res, next) => {
  let query;
  if (req.user.isRestaurant) {
    query = {
      restaurant: req.user.id
    };
  } else {
    query = {
      user: req.user.id
    };
  }

  const orders = await Order.find(query)
    .populate('restaurant')
    .populate('user')
    .populate({
      path: 'itemList',
      model: MenuItem
    });

  res.status(200).json({ success: true, data: orders });
});

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

//@desc     Update Order Status
//@route    PUT /api/v1/orders/:orderId
//@access   Private (Only a restaurant user can update the order status)
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  // Check if the user is not a normal user
  if (!req.user.isRestaurant) {
    return next(new ErrorResponse('User not authorized to update orders', 401));
  }
  // Check if orderId is being sent
  if (!req.params.orderId) {
    return next(new ErrorResponse('Order Id is required', 400));
  }

  let order = await Order.findById(req.params.orderId);

  // Check whether the order exists
  if (!order) {
    return next(
      new ErrorResponse(`No order found with the id ${req.params.orderId}`, 400)
    );
  }

  const { status } = req.body;
  // Check whether the status has been supplied
  if (!status) {
    return next(new ErrorResponse('Please send the updated status', 400));
  }

  // Check if the order belongs to this restaurant user
  if (req.user.id.toString() !== order.restaurant.toString()) {
    return next(
      new ErrorResponse('User not authorized to update this order', 401)
    );
  }

  order = await Order.findByIdAndUpdate(
    req.params.orderId,
    { status },
    { new: true }
  );

  res.status(200).json({ success: true, data: order });
});
