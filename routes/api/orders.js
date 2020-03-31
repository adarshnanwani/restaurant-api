const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const {
  createOrder,
  updateOrderStatus,
  getAllOrders
} = require('../../controllers/orders');

/**
 * @swagger
 * path:
 *  /api/v1/orders:
 *    get:
 *      summary: Fetch all orders for a restaurant/user(only one of them at a time)
 *      security:
 *        - bearerAuth: []
 *      tags: [Orders]
 *      responses:
 *        "200":
 *          description: Details updated successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    description: true when request is successful, false otherwise.
 *                  data:
 *                    type: object
 *                    properties:
 *                      _id:
 *                        type: string
 *                        description: id of the order
 *                      totalPrice:
 *                        type: number
 *                        description: total price of the order
 *                      status:
 *                        type: string
 *                        description: current status of the order
 *                      itemList:
 *                        type: array
 *                        items:
 *                          $ref: '#/components/schemas/MenuItem'
 *                      user:
 *                        $ref: '#/components/schemas/CustomerUserResponse'
 *                      restaurant:
 *                        $ref: '#/components/schemas/RestaurantUserResponse'
 *        "401":
 *          description: Unauthorized access
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    description: true when request is successful, otherwise false.
 *                  error:
 *                    type: string
 *                    description: Contains the description of the error
 *                example:
 *                  success: false
 *                  error: Unauthorized access
 */
router.route('/').get(protect, getAllOrders);

/**
 * @swagger
 * path:
 *  /api/v1/orders/{restaurantId}:
 *    post:
 *      summary: Create a new order (Only a customer user can create an order)
 *      tags: [Orders]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: restaurantId
 *          schema:
 *            type: string
 *          required: true
 *          description: Id of the restaurant where order has to be created
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *              totalPrice:
 *                type: number
 *                description: Total cost of the order
 *                example: 120
 *              itemList:
 *                type: array
 *                items:
 *                  type: string
 *                  example: 5e7c8dc3b6b7422700ef056a
 *      responses:
 *        "200":
 *          description: Order added successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    description: true when request is successful, false otherwise.
 *                  data:
 *                    type: object
 *                    properties:
 *                      _id:
 *                        type: string
 *                        description: id of the order
 *                      status:
 *                        type: string
 *                        description: current status of the order
 *                      totalPrice:
 *                        type: number
 *                        description: total cost of the order
 *                      itemList:
 *                        type: array
 *                        items:
 *                          $ref: '#/components/schemas/MenuItem'
 *                      restaurant:
 *                        $ref: '#/components/schemas/RestaurantUserResponseData'
 *                      user:
 *                        $ref: '#/components/schemas/CustomerUserResponseData'
 *        "400":
 *          description: Bad Request
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    description: true when request is successful, otherwise false.
 *                  error:
 *                    type: string
 *                    description: Contains the description of the error
 *              examples:
 *                Missing restaurantId:
 *                  value:
 *                    success: false
 *                    error: Restaurant Id is required
 *                Missing request body data:
 *                  value:
 *                    success: false
 *                    error: Please send both total price and item list with at least one item
 *                Incorrect restaurant id:
 *                  value:
 *                    success: false
 *                    error: The restaurantId sent doesn't belong to any restaurant
 *        "401":
 *          description: Unauthorized access
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    description: true when request is successful, otherwise false.
 *                  error:
 *                    type: string
 *                    description: Contains the description of the error
 *                example:
 *                  success: false
 *                  error: User not authorized to place an order
 */
router.route('/:restaurantId').post(protect, createOrder);

/**
 * @swagger
 * path:
 *  /api/v1/orders/{orderId}:
 *    put:
 *      summary: Update Order Status (Only a restaurant user can update the order status)
 *      tags: [Orders]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: orderId
 *          schema:
 *            type: string
 *          required: true
 *          description: Id of the order placed by a user
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *              status:
 *                type: string
 *                description: New status for the order
 *                example: IN PROGRESS
 *      responses:
 *        "200":
 *          description: Order status updated successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    description: true when request is successful, false otherwise.
 *                  data:
 *                    type: object
 *                    properties:
 *                      _id:
 *                        type: string
 *                        description: id of the order
 *                        example: 5e7cb3aa247e532dc51953ba
 *                      status:
 *                        type: string
 *                        description: current status of the order
 *                        example: IN PROGRESS
 *                      totalPrice:
 *                        type: number
 *                        description: total cost of the order
 *                        example: 200
 *                      itemList:
 *                        type: array
 *                        items:
 *                          $ref: '#/components/schemas/MenuItem'
 *                      restaurant:
 *                        $ref: '#/components/schemas/RestaurantUserResponseData'
 *                      user:
 *                        $ref: '#/components/schemas/CustomerUserResponseData'
 *        "400":
 *          description: Bad Request
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    description: true when request is successful, otherwise false.
 *                  error:
 *                    type: string
 *                    description: Contains the description of the error
 *              examples:
 *                Missing order id:
 *                  value:
 *                    success: false
 *                    error: Order Id is required
 *                Incorrect order id:
 *                  value:
 *                    success: false
 *                    error: No order found with the id 5e7cb3aa247e532dc51953ba
 *                Missing updated status in request body:
 *                  value:
 *                    success: false
 *                    error: Please send the updated status
 *        "401":
 *          description: Unauthorized access
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    description: true when request is successful, otherwise false.
 *                  error:
 *                    type: string
 *                    description: Contains the description of the error
 *              examples:
 *                restaurant user:
 *                  value:
 *                    success: false
 *                    error: User not authorized to update orders
 *                incorrect restaurant user:
 *                  value:
 *                    success: false
 *                    error: Restaurant not authorized to update this order
 */
router.route('/:orderId').put(protect, updateOrderStatus);

module.exports = router;
