const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const saveImage = require('../utils/saveImage');

exports.uploadImage = asyncHandler(async (req, res, next) => {
  const folderPath = `${process.env.CLOUDINARY_ROOT_APP_FOLDER}${
    req.user.isRestaurant ? '/restaurants' : '/users'
  }/${req.user.userEmail}`;
  try {
    const imageData = await saveImage(req, 'image', folderPath);
    res.status(201).json({ success: true, data: imageData });
  } catch (err) {
    if (err === 'No image found') {
      return next(new ErrorResponse('Please send an image file', 400));
    }
    if (err === 'Incorrect mimetype') {
      return next(
        new ErrorResponse('Please only add a .jpg or .png image file', 400)
      );
    }
    res.status(500).json({ success: false, data: err });
  }
});
