const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const { addMenuItem } = require('../../controllers/menuItems');

router.route('/').post(protect, addMenuItem);

module.exports = router;
