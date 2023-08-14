require('dotenv').config();
const OTP = require('../models/OTP');
const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.sendOTP = async (req, res) => {
  // Twilio API credentials (replace with your actual credentials)
  const accountSid = process.env.accountSid;
  const authToken = process.env.authToken;
  const twilioPhoneNumber = process.env.twilioPhoneNumber;
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required',
      });
    }
    //  check if user exists with this phone number
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(200).json({
        existingUser,
        success: true,
        message: 'User already exists .Login',
      });
    }

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Save the OTP to the user in the database
    const userPayload = { phoneNumber, otp };
    // console.log(userPayload);
    const user = await OTP.create(userPayload);
    // console.log(user);

    // Send the OTP via Twilio SMS
    const client = require('twilio')(accountSid, authToken);

    client.messages
      .create({
        body: `Your otp is ${otp}. The validity of OTP is 1 minutes.`,
        from: `${twilioPhoneNumber}`,
        to: `${phoneNumber}`,
      })
      .then((message) => console.log(message.sid));

    return res.status(200).json({
      user,
      success: true,
      message: 'OTP sent successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: error,
    });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: 'All the fields are required ',
      });
    }

    const existingOTP = await OTP.find({ otp });
    console.log(existingOTP);
    //  if otp expired
    if (existingOTP.length == 0) {
      return res.status(400).json({
        success: false,
        message: 'OTP is not valid',
      });
    }

    // create user in main User
    const phoneNumber = existingOTP[0].phoneNumber;

    const user = await User.findOneAndUpdate(
      { phoneNumber: phoneNumber },
      { phoneNumber: phoneNumber },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      user,
      success: true,
      message: 'OTP verified',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: error,
    });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { phoneNumber, name, email, password, confirmPassword } = req.body;
    // if some fields are not filled
    if (!phoneNumber || !name || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // check if password and confirmPassword are equal
    if (password !== confirmPassword) {
      return res.status(401).json({
        success: false,
        message: 'Password is not equal to confirm Password',
      });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // const existingUser= await User.findOne({phoneNumber});
    const user = await User.findOneAndUpdate(
      { phoneNumber },
      { name: name, password: hashedPassword, email: email, isVerified: true },
      { new: true }
    );

    return res.status(200).json({
      user,
      success: true,
      message: 'User created successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: 'Error in signing in',
    });
  }
};

exports.completeProfile = async (req, res) => {
  // Check if the required files are present in the request
  if (!req.files || !req.files['addressProof'] || !req.files['eSignature']) {
    return res.status(400).json({
      success: false,
      message: 'Missing required files in the request',
    });
  }
  // fetch the input details
  console.log(req.body);
  const phoneNumber = req.body.phoneNumber;
  console.log(phoneNumber);

  const fullName = req.body.fullName;
  console.log(fullName);
  const gstin = req.body.gstin;
  const panNumber = req.body.panNumber;
  const pinCode = req.body.pinCode;
  const businessName = req.body.businessName;
  const storeDescription = req.body.storeDescription;
  const pickUpAddress = req.body.pickUpAddress;
  const businessAddress = req.body.businessAddress;
  const addressProofFile = req.files['addressProof'][0];
  const eSignatureFile = req.files['eSignature'][0];

  try {
    const existingUser = await User.findOneAndUpdate(
      { phoneNumber: phoneNumber },
      {
        fullName: fullName,
        gstin: gstin,
        panNumber: panNumber,
        pinCode: pinCode,
        businessName: businessName,
        storeDescription: storeDescription,
        pickUpAddress: pickUpAddress,
        businessAddress: businessAddress,
        isProfileCompleted: true,
        addressProofPath: addressProofFile.path,
        eSignaturePath: eSignatureFile.path,
      },
      { new: true }
    );
    console.log(existingUser);
    // success message
    return res.status(200).json({
      existingUser,
      success: true,
      message: 'User profile updated',
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      success: false,
      message: 'Error updating the profile',
    });
  }
};

exports.logIn = async (req, res) => {
  // fetch the details from user
  const { phoneNumber, password } = req.body;

  const existingUser = await User.findOne({ phoneNumber });

  if (await bcrypt.compare(password, existingUser.password)) {
    return res.status(200).json({
      existingUser,
      success: true,
      message: 'User login successfully',
    });
  }
  return res.status(400).json({
    success: false,
    message: 'Password does not match try again',
  });
};
