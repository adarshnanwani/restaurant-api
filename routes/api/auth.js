const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateDetails
} = require('../../controllers/auth');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/me').get(protect, getMe);
router.route('/forgotpassword').post(forgotPassword);
router.route('/resetpassword/:resetToken').put(resetPassword);
router.route('/changepassword').put(protect, updatePassword);
router.route('/update').put(protect, updateDetails);

module.exports = router;
