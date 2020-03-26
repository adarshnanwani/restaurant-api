const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const {
  addMenuItem,
  deleteMenuItem,
  getAllMenuItems
} = require('../../controllers/menuItems');

router
  .route('/')
  .get(protect, getAllMenuItems)
  .post(protect, addMenuItem);
router.route('/:menuItemId').delete(protect, deleteMenuItem);

module.exports = router;
