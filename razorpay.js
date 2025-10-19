const Razorpay = require("razorpay");
const dotenv = require("dotenv")

dotenv.config()
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID_TEST,
    key_secret: process.env.RAZORPAY_KEY_SECRET_TEST,
  });

module.exports = razorpayInstance