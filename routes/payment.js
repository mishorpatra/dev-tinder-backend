const express = require("express")
const userAuth = require("../middlewares/userAuth")
const razorpayInstance = require("../razorpay")
const OrderModel = require("../models/orders")
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils')
const User = require("../models/user")


const paymentRoutes = express.Router()

paymentRoutes.post("/payment/create-order", userAuth, async (req, res) => {
    try {
        const { subscriptionPlan } = req.body
        if(!["gold", "silver"].includes(subscriptionPlan)) throw new Error("Invalid subscription plan")
        
        const amount = subscriptionPlan === "gold" ? process.env.GOLD_PLAN : process.env.SILVER_PLAN
  

        let orderDetails = await razorpayInstance.orders.create({
            amount: amount*100,
            currency: "INR",
            receipt: "receip1",
            notes: {
              subscriptionPlan: subscriptionPlan
            }
          })


        let newOrder = new OrderModel({
            amount: orderDetails?.amount,
            currency: orderDetails?.currency,
            orderId: orderDetails?.id,
            notes: orderDetails?.notes,
            status: orderDetails?.status
        })

        newOrder = await newOrder.save()
        
        return res.json({
            orderDetails: newOrder,
            prefill: {
                name: req.user.name,
                email: req.user.email
            },
            razorpay_key_id: process.env.RAZORPAY_KEY_ID_TEST
        })
    }catch(error) {
        console.log("Error while getting the order details ", error)
        return res.status(400).json({ message: error.message })
    }
})

paymentRoutes.post('/payment/webhook', async (req, res) => {
    try {
        let webhookSignature = req.get("X-Razorpay-Signature")
        let webhookSecret = process.env.WEBHOOK_SECRET
        let isValidSignature = validateWebhookSignature(JSON.stringify(req.body), webhookSignature, webhookSecret)
        if(!isValidSignature) throw new Error("Invalid signature")
        
        let orderDetail = await OrderModel.findOne({
            orderId: req.body.payload.payment.entity.order_id
        })
        if(!orderDetail) {
            throw new Error("Cannot find an order regarding this order ID")
        }
        let user = await User.findById(orderDetail.userId)
        if(!user) throw new Error("Invalid user")
        if(req.body.payload.payment.entity.status === "captured") {
            user.isPremium = true
        }

        await user.save()
        orderDetail.status = req.body.payload.payment.entity.status
        await orderDetail.save()

        return res.json({ message: "Webhook received successfully" })
    }catch(error) {
        console.log("Error while gettin the payment info ", error)
        return res.status(500).json({ message: `Error while implimenting the payment webhook ${error}` })
    }
})

paymentRoutes.post('/payment/verify',userAuth, async (req, res) => {
    try {
        const { order_id, razorpay_payment_id,  razorpay_signature } = req.body

        generated_signature = hmac_sha256(order_id + "|" + razorpay_payment_id, process.env.RAZORPAY_KEY_SECRET_TEST);

        if (generated_signature == razorpay_signature) {
            let orderDetail = await OrderModel.findOne({orderId: order_id})
            if(!orderDetail) throw new Error("Invalid order details")
            orderDetail.paymentId = razorpay_payment_id
            orderDetail.status = "captured"
            orderDetail.signature = razorpay_signature
            await orderDetail.save()
            return res.json(orderDetail)
        }
        else throw new Error("Invalid signature")
    }catch(error) {
        console.log("Error while verifying the payment ", error)
        return res.status(500).json({
            message: error.message
        })
    }
})

module.exports = paymentRoutes