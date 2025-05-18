const jwt = require("jsonwebtoken")
const User = require("../models/user")

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies

        if(!token) throw new Error("Access denied")

        let data = await jwt.verify(token, "devtindersecretkey")

        if(!data) throw new Error("Access denied")

        let user = await User.findById(data._id)
        if(!user) throw new Error("Inavild user")
        req.user = user
        next()
        
    }catch(error) {
        console.log(error)
        res.status(403).send(error.message)
    }
}

module.exports = userAuth