// const options = {
//     key: 'YOUR_KEY_ID', // Replace with your Razorpay key_id
//     amount: '50000', // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
//     currency: 'INR',
//     name: 'Acme Corp',
//     description: 'Test Transaction',
//     order_id: 'order_IluGWxBm9U8zJ8', // This is the order_id created in the backend
//     callback_url: 'http://localhost:3000/payment-success', // Your success URL
//     prefill: {
//       name: 'Gaurav Kumar',
//       email: 'gaurav.kumar@example.com',
//       contact: '9999999999'
//     },
//     theme: {
//       color: '#F37254'
//     },
//   };

const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "user"
    },
    amount: {
        type: Number,
        require: true
    },
    currency: {
        type: String,
        require: true
    },
    orderId: {
        type: String,
        require: true
    },
    paymentId: {
        type: String
    },
    signature: {
        type: String
    },
    status: {
        type: String,
        require: true
    },
    notes: {}
}, { timestamps: true })

const OrderModel = mongoose.model("order", OrderSchema)

module.exports = OrderModel
