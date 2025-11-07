const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      unique: true,
      lowercase: true,
      minlength: [3, 'Username must be at least 3 characters long'],
    },
    email: {
      type: String,
      required: false,
      trim: true,
      unique: true,
      sparse: true, // Allow multiple null values but enforce uniqueness for non-null values
      lowercase: true,
      validate: {
        validator: function(v) {
          // Only validate if email is provided
          return !v || /^\S+@\S+\.\S+$/.test(v);
        },
        message: 'Please provide a valid email address',
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Don't return password by default
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      code: String,
      expiresAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to set OTP
userSchema.methods.setOTP = function (otpCode) {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10); // OTP expires in 10 minutes

  this.otp = {
    code: otpCode,
    expiresAt,
  };
};

// Method to verify OTP
userSchema.methods.verifyOTP = function (otpCode) {
  if (!this.otp || !this.otp.code) {
    return false;
  }

  if (new Date() > this.otp.expiresAt) {
    return false; // OTP expired
  }

  return this.otp.code === otpCode;
};

// Method to clear OTP
userSchema.methods.clearOTP = function () {
  this.otp = undefined;
};

// Ensure the email index is properly configured (sparse and unique)
// This will drop and recreate the index if it exists incorrectly
userSchema.index({ email: 1 }, { unique: true, sparse: true });

const User = mongoose.model('User', userSchema);

module.exports = User;

