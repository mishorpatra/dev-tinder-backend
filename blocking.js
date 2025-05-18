const crypto = require("crypto")

console.log("blocking code ...")

let key = crypto.pbkdf2Sync("Mishor@123", "pubu", 50000000, 50, "sha512")

console.log(key)

setTimeout(() => {
    console.log("run me immediately!!!")
}, 0)

crypto.pbkdf2("Mishor@123", "pubu", 50000000, 50, "sha512", (err, key) => {
    console.log(key)
})

console.log("call stack empty")

