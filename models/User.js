const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * @swagger
 *  components:
 *    securitySchemes:
 *      bearerAuth:
 *        type: http
 *        scheme: bearer
 *        bearerFormat: JWT
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - userName
 *          - userEmail
 *          - userPassword
 *          - isRestaurant
 *          - userCity
 *          - userCountry
 *        properties:
 *          userName:
 *            type: string
 *          userEmail:
 *            type: string
 *            format: email
 *            description: Email for the user, needs to be unique.
 *          userPassword:
 *            type: string
 *            description: Password for the user, needs to be min 6 characters.
 *          isRestaurant:
 *            type: boolean
 *            description: Should be true for restaurant-type user and false for normal users.
 *          userGender:
 *            type: string
 *            description: Must either be 'Male' or 'Female'
 *          userAge:
 *            type: number
 *          userCity:
 *            type: string
 *          userCountry:
 *            type: string
 *          userProfileImageUrl:
 *            type: string
 *            description: Should be a url pointing to an image
 *          typeOfFood:
 *            type: array
 *            items:
 *              type: string
 *              description: Array of strings, should only be sent for restaurant users, ignored for normal users
 *        example:
 *          userName: John Doe
 *          userEmail: john@gmail.com
 *          userPassword: "123456"
 *          isRestaurant: false
 *          userGender: Male
 *          userAge: 22
 *          userCity: Bangalore
 *          userCountry: India
 *          userProfileImageUrl: https://example.com/photo.jpg
 *      CustomerUser:
 *        type: object
 *        required:
 *          - userName
 *          - userEmail
 *          - userPassword
 *          - isRestaurant
 *          - userCity
 *          - userCountry
 *        properties:
 *          userName:
 *            type: string
 *          userEmail:
 *            type: string
 *            format: email
 *            description: Email for the user, needs to be unique.
 *          userPassword:
 *            type: string
 *            description: Password for the user, needs to be min 6 characters.
 *          isRestaurant:
 *            type: boolean
 *            description: Should be true for restaurant-type user and false for normal users.
 *          userGender:
 *            type: string
 *            description: Must either be 'Male' or 'Female'
 *          userAge:
 *            type: number
 *          userCity:
 *            type: string
 *          userCountry:
 *            type: string
 *          userProfileImageUrl:
 *            type: string
 *            description: Should be a url pointing to an image
 *        example:
 *          userName: John Doe
 *          userEmail: john@gmail.com
 *          userPassword: "123456"
 *          isRestaurant: false
 *          userGender: Male
 *          userAge: 22
 *          userCity: Bangalore
 *          userCountry: India
 *          userProfileImageUrl: https://example.com/photo.jpg
 *      CustomerUserResponse:
 *        type: object
 *        properties:
 *          success:
 *            type: boolean
 *            example: true
 *          data:
 *            type: object
 *            properties:
 *              _id:
 *                type: string
 *                description: Object id of the user
 *                example: 5e7c8dc3b6b7422700ef056a
 *              userName:
 *                type: string
 *                example: John Doe
 *              userEmail:
 *                type: string
 *                format: email
 *                description: Email for the user, needs to be unique.
 *                example: john@gmail.com
 *              isRestaurant:
 *                type: boolean
 *                description: Should be true for restaurant-type user and false for normal users.
 *                example: false
 *              userGender:
 *                type: string
 *                description: Must either be 'Male' or 'Female'
 *                example: Male
 *              userAge:
 *                type: number
 *                example: 22
 *              userCity:
 *                type: string
 *                example: Bangalore
 *              userCountry:
 *                type: string
 *                example: India
 *              userProfileImageUrl:
 *                type: string
 *                description: Should be a url pointing to an image
 *                example: https://example.com/photo.jpg
 *      CustomerUserResponseData:
 *        type: object
 *        properties:
 *          _id:
 *            type: string
 *            description: Object id of the user
 *            example: 5e7c8dc3b6b7422700ef056a
 *          userName:
 *            type: string
 *            example: John Doe
 *          userEmail:
 *            type: string
 *            format: email
 *            description: Email for the user, needs to be unique.
 *            example: john@gmail.com
 *          isRestaurant:
 *            type: boolean
 *            description: Should be true for restaurant-type user and false for normal users.
 *            example: false
 *          userGender:
 *            type: string
 *            description: Must either be 'Male' or 'Female'
 *            example: Male
 *          userAge:
 *            type: number
 *            example: 22
 *          userCity:
 *            type: string
 *            example: Bangalore
 *          userCountry:
 *            type: string
 *            example: India
 *          userProfileImageUrl:
 *            type: string
 *            description: Should be a url pointing to an image
 *            example: https://example.com/photo.jpg
 *      RestaurantUser:
 *        type: object
 *        required:
 *          - userName
 *          - userEmail
 *          - userPassword
 *          - isRestaurant
 *          - userCity
 *          - userCountry
 *        properties:
 *          userName:
 *            type: string
 *            example: Biryani Zone
 *          userEmail:
 *            type: string
 *            format: email
 *            description: Email for the user, needs to be unique.
 *            example: biryani.zone@gmail.com
 *          userPassword:
 *            type: string
 *            description: Password for the user, needs to be min 6 characters.
 *            example: 123456
 *          isRestaurant:
 *            type: boolean
 *            description: Should be true for restaurant-type user and false for normal users.
 *            example: true
 *          userCity:
 *            type: string
 *            example: Bangalore
 *          userCountry:
 *            type: string
 *            example: India
 *          userProfileImageUrl:
 *            type: string
 *            description: Should be a url pointing to an image
 *            example: https://example.com/photo.jpg
 *          typeOfFood:
 *            type: array
 *            example: ['Chinese', 'South Indian']
 *            items:
 *              type: string
 *              description: Array of strings, should only be sent for restaurant users, ignored for normal users
 *      RestaurantUserResponse:
 *        type: object
 *        properties:
 *          success:
 *            type: boolean
 *            example: true
 *          data:
 *            type: object
 *            properties:
 *              _id:
 *                type: string
 *                description: Object id of the user
 *                example: 5e7c8dc3b6b7422700ef056a
 *              userName:
 *                type: string
 *              example: Biryani Zone
 *              userEmail:
 *                type: string
 *                format: email
 *                description: Email for the user, needs to be unique.
 *                example: biryani.zone@gmail.com
 *              isRestaurant:
 *                type: boolean
 *                description: Should be true for restaurant-type user and false for normal users.
 *                example: true
 *              userCity:
 *                type: string
 *                example: Bangalore
 *              userCountry:
 *                type: string
 *                example: India
 *              userProfileImageUrl:
 *                type: string
 *                description: Should be a url pointing to an image
 *                example: https://example.com/photo.jpg
 *              typeOfFood:
 *                type: array
 *                example: ['Chinese', 'South Indian']
 *                items:
 *                  type: string
 *                  description: Array of strings, should only be sent for restaurant users, ignored for normal users
 *      RestaurantUserResponseData:
 *        type: object
 *        properties:
 *          _id:
 *            type: string
 *            description: Object id of the user
 *            example: 5e7c8dc3b6b7422700ef056a
 *          userName:
 *            type: string
 *          example: Biryani Zone
 *          userEmail:
 *            type: string
 *            format: email
 *            description: Email for the user, needs to be unique.
 *            example: biryani.zone@gmail.com
 *          isRestaurant:
 *            type: boolean
 *            description: Should be true for restaurant-type user and false for normal users.
 *            example: true
 *          userCity:
 *            type: string
 *            example: Bangalore
 *          userCountry:
 *            type: string
 *            example: India
 *          userProfileImageUrl:
 *            type: string
 *            description: Should be a url pointing to an image
 *            example: https://example.com/photo.jpg
 *          typeOfFood:
 *            type: array
 *            example: ['Chinese', 'South Indian']
 *            items:
 *              type: string
 *              description: Array of strings, should only be sent for restaurant users, ignored for normal users
 */
const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, 'Please enter the username']
    },
    userEmail: {
      type: String,
      required: [true, 'Please enter an email'],
      unique: true,
      match: [
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please add a valid email'
      ]
    },
    userPassword: {
      type: String,
      required: [true, 'Please enter a password'],
      minlength: 6,
      select: false
    },
    isRestaurant: {
      type: Boolean,
      required: true
    },
    userGender: {
      type: String,
      enum: ['Male', 'Female']
    },
    userAge: {
      type: Number
    },
    userCity: {
      type: String,
      required: [true, 'Please enter a city']
    },
    userCountry: {
      type: String,
      required: [true, 'Please enter a country']
    },
    userProfileImageUrl: {
      type: String
    },
    typeOfFood: {
      type: [String]
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  {
    timestamps: true
  }
);

// Hash the user password
UserSchema.pre('save', async function(next) {
  // Skip if the password isn't modified(new user/change password)
  if (!this.isModified('userPassword')) {
    next();
  }

  const salt = await bcryptjs.genSalt(10);
  this.userPassword = await bcryptjs.hash(this.userPassword, salt);
  next();
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    {
      id: this._id
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE
    }
  );
};

// Match user entered password to hashed password in database
UserSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.userPassword);
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and reset to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  console.log(resetToken);
  return resetToken;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
