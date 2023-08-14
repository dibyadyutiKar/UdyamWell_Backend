const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  phoneNumber: {
    type: String,
  },
  // signin
  email: {
    type: String,
  },
  name: {
    type: String,
  },
  password: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  // profile start
  fullName: {
    type: String,
  },
  gstin: {
    type: String,
  },
  businessAddress: {
    type: String,
  },
  panNumber: {
    type: String,
  },
  pinCode: {
    type: String,
  },
  addressProofPath: {
    type: String,
  },
  eSignaturePath: {
    type: String,
  },
  // page 2
  businessName: {
    type: String,
  },
  storeDescription: {
    type: String,
  },
  pickUpAddress: {
    type: String,
  },
  isProfileCompleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('User', userSchema);
