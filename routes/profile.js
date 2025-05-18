const express = require("express")
const userAuth = require("../middlewares/userAuth")
const { validateUpdate } = require("../utils/validate")
const bcrypt = require("bcrypt")
const validator = require("validator")

const profileRouter = express.Router()

profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
       
        res.send(req.user)
    }catch(error) {
        console.log(error)
        res.status(400).send(error.message)
    }
})

profileRouter.patch("/profile", userAuth, async (req, res) => {
    try {
        if(!validateUpdate(req)) throw new Error("data invalid for updates")

        const loggedInUser = req.user
        console.log(loggedInUser)
        Object.keys(req.body).forEach(k => loggedInUser[k] = req.body[k])
        console.log(loggedInUser)

        await loggedInUser.save()

        res.json({
            message: `${loggedInUser.firstName}, your profile is updated`,
            data: loggedInUser
        })
    }catch(error) {
        console.log(error)
        res.status(400).send(error.message)
    }
})

profileRouter.patch("/update-password", userAuth, async (req, res) => {
    try {
        let loggedInUser = req.user


        let isMatched = await loggedInUser.comparePassword(req.body.oldPassword)
        if(!isMatched) throw new Error("Password did not match")
        if(!validator.isStrongPassword(req.body.newPassword)) throw new Error("Please provide a strong password")

        let hashedPassword = await bcrypt.hash(req.body.newPassword, 10)

        loggedInUser.password = hashedPassword
        await loggedInUser.save()

        res.json({
            message: "Password updated"
        })
    }catch(error) {
        console.log(error)
        res.status(400).send(error.message)
    }
})

module.exports = profileRouter