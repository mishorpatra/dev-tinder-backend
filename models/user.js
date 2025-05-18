const mongoose = require("mongoose")
const validator = require("validator")
const jwt = require("jsonwebtoken")
const bycript = require("bcrypt")

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 30
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: (value) => {
            if(!validator.isEmail(value)) {
                throw new Error("Not a valid email ID ",  value)
            }
        }
    },
    password: {
        type: String,
        validate: (value) => {
            if(!validator.isStrongPassword(value)) {
                throw new Error("Not a strong password ", value)
            }
        }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate: (value) => {
            if(!["male", "female", "others"].includes(value)) {
                throw new Error("Not a valied gender option")
            }
        }
    },
    skills: [String],
    profilePhoto: {
        type: String,
        default: "https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-male-user-profile-vector-illustration-isolated-background-man-profile-sign-business-concept_157943-38764.jpg?semt=ais_hybrid&w=740",
        validate: (value) => {
            if(!validator.isURL(value)) {
                throw new Error("Enter a valid Photo url ", value)
            }
        }
    },
    about: {
        type: String,
        default: "This is a custom about"
    }
}, {
    timestamps: true
})

userSchema.index({ firstName: 1, lastName: 1 })



userSchema.methods.getJWT = async function() {
    const user = this

    let token = await jwt.sign({_id: user._id}, "devtindersecretkey")

    return token

}

userSchema.methods.comparePassword = async function(password) {
    const user = this

    let hashedPassword = await bycript.compare(password, user.password)
    return hashedPassword
}

module.exports = mongoose.model("User", userSchema)