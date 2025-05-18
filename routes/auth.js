const express = require("express")
const { validate } = require("../utils/validate")
const User = require("../models/user")
const validator = require("validator")
const bcrypt = require("bcrypt")

const authRouter = express.Router()

authRouter.post("/signup", async (req, res) => {

    //creating a new instance of the user model

    try {
        validate(req)

        const { firstName, lastName, email, password } = req.body

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            firstName,
            lastName,
            password: hashedPassword,
            email
        })

        let savedUser = await newUser.save()
        let token = await savedUser.getJWT()
        console.log(token)
        res.cookie("token", token)

        res.json({message: "User saved successfully", data: savedUser})
    }catch(error) {
        console.error(error)
        res.status(400).send("Bad request")
    }
})

authRouter.post("/signin", async(req, res) => {
    try {
        const { email, password } = req.body

        if(!validator.isEmail(email)) throw new Error("Invalid email")
        let user = await User.findOne({ email })
        if(!user) throw new Error("Invalid credentials")
        
        let isCorrect = await user.comparePassword(password)
        if(!isCorrect) throw new Error("Invalid credentials")

        let token = await user.getJWT()

        user.password = null
        res.cookie("token", token)
        res.json(user)

    }catch(error) {
        console.log(error)
        res.status(400).send(error.message)
    }
})

authRouter.post("/logout", (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    }).send({ message: "Logged out successfully" })
})

module.exports = authRouter