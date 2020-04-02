const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const {
  addMenuItem,
  deleteMenuItem,
  getAllMenuItems,
  getMenuItemsForRestaurant
} = require('../../controllers/menuItems');

/**
 * @swagger
 * paths:
 *  /api/v1/menuitems:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      summary: Get all menu items for a restaurant user
 *      tags: [MenuItems]
 *      responses:
 *        "200":
 *          description: Success message
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    description: true when request is successful, otherwise false.
 *                  data:
 *                    schema:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/MenuItem'
 *
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
 *    post:
 *      security:
 *        - bearerAuth: []
 *      summary:  Add a menu item (only for restaurant users)
 *      tags: [MenuItems]
 *      responses:
 *        "200":
 *          description: Success message
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    description: true when request is successful, otherwise false.
 *                  data:
 *                    schema:
 *                    $ref: '#/components/schemas/MenuItem'
 *
 *        "400":
 *          description: Bad Request - When all the required fields aren't sent
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
 *                  error: Please add item title,Please add item price
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
 *                  error: User not authorized to add a menu item
 */
router
  .route('/')
  .get(protect, getAllMenuItems)
  .post(protect, addMenuItem);

/**
 * @swagger
 * paths:
 *  /api/v1/menuitems/{restaurantId}:
 *    get:
 *      summary: Public method to get all menu items for a restaurant user
 *      tags: [MenuItems]
 *      parameters:
 *        - in: path
 *          name: restaurantId
 *          schema:
 *            type: string
 *          required: true
 *          description: ObjectId of the restaurant
 *      responses:
 *        "200":
 *          description: Success message
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    description: true when request is successful, otherwise false.
 *                  data:
 *                    schema:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/MenuItem'
 *
 *        "404":
 *          description: Restaurant doesn't exist
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
 *                  error: No menu items found for this restaurant
 *  */
router.route('/:restaurantId').get(getMenuItemsForRestaurant);

/**
 * @swagger
 * path:
 *  /api/v1/menuitems/{menuItemId}:
 *    delete:
 *      summary: Delete a menu item (for a restaurant user)
 *      tags: [MenuItems]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: menuItemId
 *          schema:
 *            type: string
 *          required: true
 *          description: ObjectId of the menu item to be deleted
 *      responses:
 *        "200":
 *          description: On successful deletion of menu item
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
 *                    description: Empty object
 *        "400":
 *          description: Invalid token
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
 *                    description: error message
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
 *                    description: error message
 *                example:
 *                  success: false
 *                  error: User not authorized to delete a menu item
 *        "404":
 *          description: No item found with the sent menuItemId
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
 *                    description: error message
 *                example:
 *                  success: false
 *                  error: No menu item found with id 5e7c8dd6b6b7422700ef056b
 *        "500":
 *          description: Server error
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
 */
router.route('/:menuItemId').delete(protect, deleteMenuItem);

module.exports = router;
