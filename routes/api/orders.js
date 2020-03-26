const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const { createOrder, updateOrderStatus } = require('../../controllers/orders');

router.route('/:restaurantId').post(protect, createOrder);
router.route('/:orderId').put(protect, updateOrderStatus);

module.exports = router;
