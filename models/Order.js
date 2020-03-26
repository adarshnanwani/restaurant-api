const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['PENDING', 'IN PROGRESS', 'DELIVERED'],
      default: 'PENDING'
    },
    totalPrice: {
      type: Number,
      required: true
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    itemList: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'MenuItem'
    }
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
