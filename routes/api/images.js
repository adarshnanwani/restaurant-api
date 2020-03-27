const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const { uploadImage } = require('../../controllers/images');

router.route('/').post(protect, uploadImage);

module.exports = router;
