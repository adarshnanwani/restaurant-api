const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const { createOrder } = require('../../controllers/orders');

router.route('/:restaurantId').post(protect, createOrder);

module.exports = router;
