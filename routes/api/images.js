const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const { uploadImage } = require('../../controllers/images');

/**
 * @swagger
 * path:
 *  /api/v1/images:
 *    post:
 *      summary: Uploads an image and returns remote url
 *      tags: [Images]
 *      consumes:
 *        - multipart/form-data:
 *      parameters:
 *        - in: formData
 *          name: image
 *          type: file
 *          description: image to upload
 *      responses:
 *        "200":
 *          description: Image uploaded successfully
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
 *                      width:
 *                        type: number
 *                        description: Width of the uploaded image
 *                        example: 507
 *                      height:
 *                        type: number
 *                        description: Height of the uploaded image
 *                        example: 201
 *                      format:
 *                        type: string
 *                        description: File format of the uploaded image
 *                        example: png
 *                      url:
 *                        type: string
 *                        description: Unsecured url(http) of the uploaded image
 *                        example: http://res.cloudinary.com/adynanwani/image/upload/v1585494310/food-app/restaurants/biryani.zone%40gmail.com/2020-03-29T15:05:08.955Z.png
 *                      secure_url:
 *                        type: string
 *                        description: Secured url(https) of the uploaded image
 *                        example: http://res.cloudinary.com/adynanwani/image/upload/v1585494310/food-app/restaurants/biryani.zone%40gmail.com/2020-03-29T15:05:08.955Z.png
 *                      original_filename:
 *                        type: string
 *                        description: File format of the uploaded image
 *                        example: John
 *        "400":
 *          description: Bad request
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
 *                No image found:
 *                  value:
 *                    success: false
 *                    error: Please send an image file
 *                Incorrect mimetype:
 *                  value:
 *                    success: false
 *                    error: Please only add a .jpg or .png image file
 */
router.route('/').post(uploadImage);

module.exports = router;
