const mongoose = require('mongoose');

/**
 * @swagger
 *  components:
 *    schemas:
 *      Order:
 *        type: object
 *        required:
 *          - totalPrice
 *          - restaurant
 *          - itemList
 *        properties:
 *          totalPrice:
 *            type: number
 *            description: Total price of the order
 *          restaurant:
 *            type: string
 *            description: Id of the restaurant
 *          itemList:
 *            type: array
 *            description: Array of id(s) of the menuitems
 *            items:
 *              $ref: '#/components/schemas/MenuItem'
 *          status:
 *            type: string
 *            description: It can be only one of the three types - 'PENDING', 'IN PROGRESS' & 'DELIVERED'
 *        example:
 *          chooseItemType: Vegetarian
 *          itemImageUrl: https://example.com/photo.jpg
 *          itemIngredients: Milk, Coffee, Sugar
 *          itemPrice: 120
 *          itemTitle: Cold Coffee
 *          status: IN PROGRESS
 */
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
