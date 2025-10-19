const userAuth = require("../middlewares/userAuth")
const ChatRoom = require("../models/chatRoom")
const express = require("express")

const ChatRouter = express.Router()

ChatRouter.get('/chats/:targetUserId', userAuth , async (req, res) => {
    try {
        let userId = req.user._id
        let { targetUserId } = req.params

        let existingChatRoom = await ChatRoom.findOne({
            participants: { $all:  [userId, targetUserId]}
        }).populate("chats")

        return res.json(existingChatRoom)
    }catch(error) {
        console.log("Error while getting the chats ", error)
        return res.status(500).json({ message: error.message })
    }
})



module.exports = ChatRouter