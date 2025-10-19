const mongoose = require("mongoose");

const ChatRooSchema = mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    chats: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "chat"
    }]
}, { timestamps: true })

const ChatRoom = mongoose.model("chatRoom", ChatRooSchema)
module.exports = ChatRoom