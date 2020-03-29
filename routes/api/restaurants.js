const express = require('express');
const router = express.Router();
const { getAllRestaurants } = require('../../controllers/restaurants');

/**
 * @swagger
 * path:
 *  /api/v1/restaurants:
 *    get:
 *      summary: Fetch all restaurants in the database
 *      tags: [Restaurants]
 *      responses:
 *        "200":
 *          description: Restaurants fetched successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    description: true when request is successful, false otherwise.
 *                    example: true
 *                  count:
 *                    type: number
 *                    description: Number of restaurants returned in the response body
 *                  example: 1
 *                  data:
 *                    schema:
 *                    type: array
 *                    description: restaurants
 *                    items:
 *                      $ref: '#/components/schemas/User'
 */
router.route('/').get(getAllRestaurants);

module.exports = router;
