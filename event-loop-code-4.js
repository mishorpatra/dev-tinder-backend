const fs = require("fs")

setImmediate(() => console.log("set immediate"))

setTimeout(() => console.log("Timer expired"), 0)


Promise.resolve("Promise").then(console.log)

fs.readFile('./file.txt', 'utf8', () => {
    console.log("File reading CB")
})

process.nextTick(() => {
    process.nextTick(() => {
        Promise.resolve("inner Promise").then(console.log)
        console.log("inner next tick")
        
    }
    )
    console.log("next tick")
})

console.log("last line of the code")

//last line of the code
//next tick
//inner next tick
//Promise
//timer expired
//set immediate
//file reading CB