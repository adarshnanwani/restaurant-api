const MenuItem = require('../models/MenuItem');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

//@desc     Add a menuitem
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
