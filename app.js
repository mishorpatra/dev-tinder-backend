const express = require("express")
const dbConnect = require("./config/database")
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")
const userRouter = require("./routes/user")
const cors = require("cors")
const paymentRoutes = require("./routes/payment")
const dotenv = require("dotenv")
const http = require("http")
const initializeSocket = require("./sockets/socket")
const { getChats } = require("./routes/chat")
const ChatRouter = require("./routes/chat")


const app = express()
dotenv.config()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())



app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)
app.use("/", paymentRoutes)
app.use("/", ChatRouter)

const server = http.createServer(app)
initializeSocket(server)




dbConnect().then(res => {
   console.log("Database connected...") 
   server.listen(8080, () => {
    console.log("Server has started at port ", 8080)
   })
}).catch(err => {
    console.error("Database connection failed...")
    console.error(err)
})




// app.use('/hello/2', (req, res) => {
//     res.send("Hello world 2")
// })

// app.use('/hello', (req, res) => {
//     res.send("Hello world")
// })

