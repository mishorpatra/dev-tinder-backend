const express = require("express")
const userAuth = require("../middlewares/userAuth")
const User = require("../models/user")
const ConnectionRequest = require("../models/connectionRequest")

const requestRouter = express.Router()

requestRouter.post("/connection/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const { status, toUserId } = req.params

        const fromUserId = req.user._id

        if(!["interested", "ignored"].includes(status)) throw new Error("Not a valid status "+status)
        let toUser = await User.findById(toUserId)
        if(!toUser) throw new Error("Not a valid user")
        let existingRequest = await ConnectionRequest.findOne({ 
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })

        if(existingRequest) throw new Error("Connection already exists")

        let newRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        await newRequest.save()
        
        res.send({
            message: `${req.user.firstName} ${status} ${toUser.firstName}`,
            data: newRequest
        })

    }catch(error) {
        console.log(error)
        res.status(400).send({message: error.message})
    }
})

requestRouter.post("/review/:status/:requestId", userAuth, async(req, res) => {
    try {
        const { status, requestId } = req.params

        if(!["accepted", "rejected"].includes(status)) throw new Error("invalid status "+status)
        let connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: req.user._id,
            status: "interested"
        })

        if(!connectionRequest) throw new Error("connection request not found")

        connectionRequest.status = status
        await connectionRequest.save()

        res.json({
            message: req.user.firstName+" "+status+" the request",
            data: connectionRequest
        })


    }catch(error){
        console.log("ERROR: ", error.message)
        res.status(400).json({error: error.message})
    }
})


module.exports = requestRouter