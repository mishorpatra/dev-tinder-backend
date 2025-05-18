const fs = require("fs")
const http = require("http")

setImmediate(() => console.log("set immediate"))

setTimeout(() => console.log("set timeout"), 0)


Promise.resolve("Promis").then(console.log)

http.get("https://www.fbi.com", (data) => {
    console.log("data has come")
})

fs.readFile('./file.txt', "utf8", () => {
    setTimeout(() => console.log("2nd timer"), 0)

    process.nextTick(() => console.log("2nd next tick"))

    setImmediate(() => console.log("2nd immediate"))

    console.log("file reading CB")
})

process.nextTick(() => console.log("next tick"))

console.log("Last line of code")



//last line of code
// next tick
//Promise
//set timeout
//set immediate
//file reading CB
//2nd next tick
//2nd immediate
//2nd timer
