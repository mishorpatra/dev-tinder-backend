const { Server } = require("socket.io")
const crypto = require("crypto")
const ChatRoom = require("../models/chatRoom")
const Chat = require("../models/chat")

const createHash = (userId, targetUserId) => {
    return crypto.createHash("sha256").update([userId, targetUserId].sort().join("$")).digest('hex')
}

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173"
        }
    })


   io.on("connection", socket => {
    socket.on("join-chat", async ({userId, targetUserId}) => {
        let roomId = createHash(userId, targetUserId)

        socket.join(roomId)

        let existingChatRoom = await ChatRoom.findOne({
            participants: { $all: [userId, targetUserId] }
        })
        if(!existingChatRoom) {
            let newChatRoom = new ChatRoom({
                participants: [userId, targetUserId],
                chats: []
            })

            await newChatRoom.save()
        }
        
    })

    socket.on("send-message", async ({userId, targetUserId, text, name, photoUrl}) => {
        let roomId = createHash(userId, targetUserId)
        
        let timestamp = new Date().toLocaleTimeString()

        socket.to(roomId).emit("receive-message", {userId, targetUserId, text, timestamp, name, photoUrl })

        let existingChatRoom = await ChatRoom.findOne({
            participants: { $all: [userId, targetUserId] }
        })
        let newChat = new Chat({
            senderId: userId,
            text: text
        })
        let currentChat = await newChat.save()
        existingChatRoom.chats.push(currentChat._id)
        await existingChatRoom.save()

    })

   })
}

module.exports = initializeSocket