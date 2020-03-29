const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const User = require('../../models/User');
const {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateDetails,
  logout
} = require('../../controllers/auth');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Auth details
 */

/**
 * @swagger
 * path:
 *  /api/v1/auth/register:
 *    post:
 *      summary: Register a new user (customer/restaurant)
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              oneOf:
 *                - $ref: '#/components/schemas/CustomerUser'
 *                - $ref: '#/components/schemas/RestaurantUser'
 *            examples:
 *              Customer User:
 *                value:
 *                  userName: John Doe
 *                  userEmail: john@gmail.com
 *                  userPassword: "123456"
 *                  isRestaurant: false
 *                  userGender: Male
 *                  userAge: 22
 *                  userCity: Bangalore
 *                  userCountry: India
 *                  userProfileImageUrl: https://example.com/photo.jpg
 *              Restaurant User:
 *                value:
 *                  userName: Biryani Zone
 *                  userEmail: biryani.zone@gmail.com
 *                  userPassword: "123456"
 *                  isRestaurant: true
 *                  userCity: Bangalore
 *                  userCountry: India
 *                  userProfileImageUrl: https://example.com/photo.jpg
 *                  typeOfFood: ['North Indian', 'Chinese', 'Biryani']
 *      responses:
 *        "200":
 *          description: User successfully registered
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    description: true when request is successful, false otherwise.
 *                  token:
 *                    type: string
 *                    description: JWT token
 *        "400":
 *          description: Bad Request
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    description: true when request is successful, false otherwise.
 *                  error:
 *                    type: string
 *                    description: Error messages
 *                example:
 *                  success: false
 *                  error: Please enter an email,Please enter a password
 */
router.route('/register').post(registerUser);

/**
 * @swagger
 * path:
 *  /api/v1/auth/login:
 *    post:
 *      summary: Login a user
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - userEmail
 *                - userPassword
 *              properties:
 *                userEmail:
 *                  type: string
 *                  description: User's email address
 *                userPassword:
 *                  type: string
 *                  description: User's password
 *              example:
 *                userEmail: john@gmail.com
 *                userPassword: "123456"
 *      responses:
 *        "200":
 *          description: Successful Login
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    description: true when request is successful, false otherwise.
 *                  token:
 *                    type: string
 *                    description: JWT token
 *        "401":
 *          description: Invalid password / Unauthorized access
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    description: true when request is successful, false otherwise.
 *                  error:
 *                    type: string
 *                    description: Error message
 *                example:
 *                  success: false
 *                  error: Invalid credentials
 */
router.route('/login').post(loginUser);

/**
 * @swagger
 * path:
 *  /api/v1/auth/logout:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      summary: Logs the user out and clears cookie
 *      tags: [Auth]
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
 *                    description: true when request is successful, false otherwise.
 *                  data:
 *                    type: object
 */
router.route('/logout').get(protect, logout);

/**
 * @swagger
 * path:
 *  /api/v1/auth/me:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      summary: Get currently logged in user's details
 *      tags: [Auth]
 *      responses:
 *        "200":
 *          description: Success message
 *          content:
 *            application/json:
 *              schema:
 *                oneOf:
 *                  - $ref: '#/components/schemas/CustomerUserResponse'
 *                  - $ref: '#/components/schemas/RestaurantUserResponse'
 *              examples:
 *                Customer User Response:
 *                  value:
 *                    success: true
 *                    data:
 *                      _id: 5e7c8dc3b6b7422700ef056a
 *                      userName: John Doe
 *                      userEmail: john@gmail.com
 *                      isRestaurant: false
 *                      userGender: Male
 *                      userAge: 22
 *                      userCity: Bangalore
 *                      userCountry: India
 *                      userProfileImageUrl: https://example.com/photo.jpg
 *                Restaurant User Response:
 *                  value:
 *                    success: true
 *                    data:
 *                      _id: 5e7c8dc3b6b7422700ef056a
 *                      userName: Biryani Zone
 *                      userEmail: biryani.zone@gmail.com
 *                      isRestaurant: true
 *                      userCity: Bangalore
 *                      userCountry: India
 *                      userProfileImageUrl: https://example.com/photo.jpg
 *                      typeOfFood: ['North Indian', 'Chinese', 'Biryani']
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
router.route('/me').get(protect, getMe);

/**
 * @swagger
 * path:
 *  /api/v1/auth/forgotpassword:
 *    get:
 *      summary: Sends out an email to user with reset token
 *      tags: [Auth]
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: body
 *          schema:
 *            type: object
 *            required:
 *              - email
 *            properties:
 *              email:
 *                type: string
 *            example:
 *              email: john@gmail.com
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
 *                    type: string
 *        "500":
 *          description: Error message
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    description: true when request is successful, otherwise false.
 *                  data:
 *                    type: string
 */
router.route('/forgotpassword').post(forgotPassword);

/**
 * @swagger
 * path:
 *  /api/v1/auth/resetpassword/{resetToken}:
 *    put:
 *      summary: Reset password with password reset token
 *      tags: [Auth]
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: resetToken
 *          schema:
 *            type: string
 *          required: true
 *          description: Reset token sent via email to the user
 *        - in: body
 *          schema:
 *            type: object
 *            required:
 *              - password
 *            properties:
 *              password:
 *                type: string
 *                description: New password to be set
 *            example:
 *              password: 123456
 *      responses:
 *        "200":
 *          description: User JWT token
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    description: true when request is successful, false otherwise.
 *                  token:
 *                    type: string
 *                    description: JWT token
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
 */
router.route('/resetpassword/:resetToken').put(resetPassword);

/**
 * @swagger
 * path:
 *  /api/v1/auth/changepassword:
 *    put:
 *      summary: Change the account password
 *      security:
 *        - bearerAuth: []
 *      tags: [Auth]
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: body
 *          schema:
 *            type: object
 *            required:
 *              - currentPassword
 *              - newPassword
 *            properties:
 *              currentPassword:
 *                type: string
 *                description: The current password of the user
 *              newPassword:
 *                type: string
 *                description: The new password which needs to be set
 *            example:
 *              currentPassword: 123456
 *              newPassword: 12345678
 *      responses:
 *        "200":
 *          description: Password changed successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    description: true when request is successful, false otherwise.
 *                  token:
 *                    type: string
 *                    description: JWT token
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
router.route('/changepassword').put(protect, updatePassword);

/**
 * @swagger
 * path:
 *  /api/v1/auth/update:
 *    put:
 *      summary: Update the users details (name and email)
 *      security:
 *        - bearerAuth: []
 *      tags: [Auth]
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: body
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                description: Name of the user
 *              email:
 *                type: string
 *                description: Email of the user
 *            example:
 *              name: John Doe
 *              email: john@gmail.com
 *      responses:
 *        "200":
 *          description: Details updated successfully
 *          content:
 *            application/json:
 *              schema:
 *                oneOf:
 *                  - $ref: '#/components/schemas/CustomerUserResponse'
 *                  - $ref: '#/components/schemas/RestaurantUserResponse'
 *              examples:
 *                Customer User Response:
 *                  value:
 *                    success: true
 *                    data:
 *                      _id: 5e7c8dc3b6b7422700ef056a
 *                      userName: John Doe
 *                      userEmail: john@gmail.com
 *                      isRestaurant: false
 *                      userGender: Male
 *                      userAge: 22
 *                      userCity: Bangalore
 *                      userCountry: India
 *                      userProfileImageUrl: https://example.com/photo.jpg
 *                Restaurant User Response:
 *                  value:
 *                    success: true
 *                    data:
 *                      _id: 5e7c8dc3b6b7422700ef056a
 *                      userName: Biryani Zone
 *                      userEmail: biryani.zone@gmail.com
 *                      isRestaurant: true
 *                      userCity: Bangalore
 *                      userCountry: India
 *                      userProfileImageUrl: https://example.com/photo.jpg
 *                      typeOfFood: ['North Indian', 'Chinese', 'Biryani']
 *        "400":
 *          description: Bad Request - Send either name or email or both
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
 *                  error: Please enter either email or name or both
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
router.route('/update').put(protect, updateDetails);

module.exports = router;
