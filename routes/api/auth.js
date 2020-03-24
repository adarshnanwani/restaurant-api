const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const {
  registerUser,
  loginUser,
  getMe,
  forgotPassword
} = require('../../controllers/auth');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/me').get(protect, getMe);
router.route('/forgotpassword').post(forgotPassword);

module.exports = router;
