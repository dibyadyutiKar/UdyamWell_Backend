const express = require('express');
const router = express.Router();
const multer = require('multer');

const {
  sendOTP,
  verifyOTP,
  completeProfile,
  signIn,
  logIn,
} = require('../controllers/user_controller');

// Set up the storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueFilename = Date.now() + '-' + file.originalname;
    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage });

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/signIn', signIn);
router.post(
  '/complete-profile',
  upload.fields([
    { name: 'addressProof', maxCount: 1 },
    { name: 'eSignature', maxCount: 1 },
  ]),
  completeProfile
);
router.post('/login', logIn);

module.exports = router;
