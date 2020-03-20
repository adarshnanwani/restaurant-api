const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    }
  },
  {
    timestamps: true
  }
);

// Hash the user password
UserSchema.pre('save', async function(next) {
  // Skip if the password isn't modified(new user/change password)
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcryptjs.genSalt(10);
  this.password = bcryptjs.hash(this.password, salt);
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
