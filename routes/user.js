const express = require("express")
const userAuth = require("../middlewares/userAuth")
const ConnectionRequest = require("../models/connectionRequest")
const User = require("../models/user")
const userRouter = express.Router()

const USER_VALUES_SAFE = "firstName lastName profilePhoto"

const USER_VALUES_SAFE_LONG = "firstName lastName profilePhoto skills about "

userRouter.get("/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user

        let requests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", USER_VALUES_SAFE)

        res.json({
            "message": "Connection requests fetched successfully",
            data: requests
        })

    }catch(error) {
        console.log("ERROR: ", error)
        res.status(400).json({ message: error.message })
    }
})

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user

        let connections = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id, status: "accepted"},
                {toUserId: loggedInUser._id, status: "accepted"}
            ]
        }).populate("fromUserId", USER_VALUES_SAFE).populate("toUserId", USER_VALUES_SAFE)

        let data = connections.map(elm => {
            if(elm.toUserId._id.toString() === loggedInUser._id.toString()) return elm.fromUserId
            else return elm.toUserId
        })

        res.json({
            message: "Connections fetched successfully",
            data
        })


    }catch(error) {
        console.log("ERROR: ", error)
        res.status(400).json({ message: error.message })
    }
})

userRouter.get("/user/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user

        const page = parseInt(req.query.page) || 1
        let limit = parseInt(req.query.limit) || 10
        limit = limit > 50 ? 50 : limit
        const skip = (page-1)*limit


        let connectionRequests = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ]
        }).select("fromUserId toUserId")

        const hiddenUsersFromFeed = new Set()
        connectionRequests.forEach(request => {
            hiddenUsersFromFeed.add(request.fromUserId.toString())
            hiddenUsersFromFeed.add(request.toUserId.toString())
        })

        let users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hiddenUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id }}
            ]
        }).select(USER_VALUES_SAFE_LONG).skip(skip).limit(limit)

        res.json({
            message: "user fetched successfully",
            data: users
        })

    }catch(error) {
        console.log("ERROR:- ", error)
        res.status(400).json({ message: error.message })
    }
})

module.exports = userRouter