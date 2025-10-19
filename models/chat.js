const mongoose = require("mongoose");

const ChatSchema = mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    text: String
}, { timestamps: true  })

const Chat = mongoose.model("chat", ChatSchema)
module.exports = Chat