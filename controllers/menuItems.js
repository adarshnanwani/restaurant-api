const MenuItem = require('../models/MenuItem');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

//@desc     Add a menu item
//@route    POST /api/v1/menuitems
//@access   Private (only for restaurant users)
exports.addMenuItem = asyncHandler(async (req, res, next) => {
  // Check if the user is a restaurant
  if (!req.user.isRestaurant) {
    return next(
      new ErrorResponse('User not authorized to add a menu item', 401)
    );
  }
  // Tag it to the restaurant user
  req.body.user = req.user.id;

  const menuItem = await MenuItem.create(req.body);

  res.status(201).json({ success: true, data: menuItem });
});

//@desc     Delete a menu item
//@route    DELETE /api/v1/menuitems/:menuItemId
//@access   Private (only for restaurant users)
exports.deleteMenuItem = asyncHandler(async (req, res, next) => {
  // Check if the user is a restaurant
  if (!req.user.isRestaurant) {
    return next(
      new ErrorResponse('User not authorized to delete a menu item', 401)
    );
  }

  // Check if the menu item exists
  const menuItem = await MenuItem.findById(req.params.menuItemId);

  if (!menuItem) {
    return next(
      new ErrorResponse(
        `No menu item found with id ${req.params.menuItemId}`,
        404
      )
    );
  }

  // Check if the menu item belongs to this user
  if (menuItem.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `No menu item found with id ${req.params.menuItemId}`,
        404
      )
    );
  }

  // If everything goes well, then remove the menu item
  await menuItem.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

//@desc     Get all menu items for a restaurant user
//@route    GET /api/v1/menuitems
//@access   Private (only for restaurant users)
exports.getAllMenuItems = asyncHandler(async (req, res, next) => {
  // Check if the user is a restaurant
  if (!req.user.isRestaurant) {
    return next(new ErrorResponse('Unauthorized access', 401));
  }

  const menuItems = await MenuItem.find({ user: req.user.id });

  res.status(200).json({ success: true, data: menuItems });
});
