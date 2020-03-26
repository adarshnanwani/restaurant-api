const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema(
  {
    chooseItemType: {
      type: String,
      required: [true, 'Please select an item type']
    },
    itemImageUrl: {
      type: String,
      required: [true, 'Please select an item image']
    },
    itemIngredients: {
      type: String,
      required: [true, 'Please add item ingredients']
    },
    itemPrice: {
      type: Number,
      required: [true, 'Please add item price']
    },
    itemTitle: {
      type: String,
      required: [true, 'Please add item title']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

const MenuItem = mongoose.model('MenuItem', MenuItemSchema);

module.exports = MenuItem;
