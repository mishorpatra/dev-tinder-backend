const mongoose = require("mongoose")

const ConnectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "User"
    },
    toUserId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "User"
    },
    status: {
        type: String,
        enum: {
            values: ["interested", "ignored", "accepted", "rejected"],
            message: "{VALUE} is not a valid status"
        }
    }

}, {timestamps: true})

ConnectionRequestSchema.index({ fromUserId: 1, toUserId: 1 })

ConnectionRequestSchema.pre("save", function(next) {
    if(this.fromUserId.equals(this.toUserId)) throw new Error("cannot send connection request to yourself")
    next()
})

const ConnectionRequest = mongoose.model("connectionRequest", ConnectionRequestSchema)
module.exports = ConnectionRequest