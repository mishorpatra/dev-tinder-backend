const validator = require("validator")

const validate = (req) => {
    const { firstName, lastName, email, password } = req.body

    if(!firstName || !lastName) {
        throw new Error("Invalid firstname and lastname")
    }

    if(!validator.isEmail(email)) {
        throw new Error("Invalid Email")
    }

    if(!validator.isStrongPassword(password)) {
        throw new Error("Please add a strong password")
    }
}

const validateUpdate = (req) => {
    const allowUpdates = ["firstName", "lastName", "age", "gender", "about", "profilePhoto", "skills"]

    return Object.keys(req.body).every(key => allowUpdates.includes(key))

}

module.exports = { validate, validateUpdate }