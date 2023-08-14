const mongoose = require('mongoose');

const OTPSchema = mongoose.Schema(
  {
    phoneNumber: {
      type: String,
    },
    otp: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      expires: 2 * 60,
    },
  }
  // { timeStamps: true }
);

module.exports = mongoose.model('OTP', OTPSchema);
