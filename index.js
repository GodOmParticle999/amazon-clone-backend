import dotenv from "dotenv"
import  Express  from "express"

import cors from "cors"
import userRouter from "./routes/user.route.js"
import dbConnect from "./db/db.js"
import errorHandler from "./middlewares/errorHandler.js"
import cookieParser from "cookie-parser"
// import dotenv.config at the top
dotenv.config()

const app=Express()



// connection to db
dbConnect().then(()=>{
    app.listen(process.env.PORT||8000,()=>{
        console.log(`server is listening at port ${process.env.PORT}`)
    })
}).catch((e)=>{
    console.log("db connection failed",e)
})
// middlewares

// this middleware allows all the incoming request from client side 
app.use(cors())
// this parses the cookie header and populates the req.cookies object in a key value paired manner 
const myCookie=(_,res,next)=>{
    app.use(cookieParser)
    next()
}
app.use(myCookie)

app.use(Express.json())

// this middleware leads to all the routes that come to user route
app.use("/user",userRouter)

// this middleware handles all kind of errors
app.use(errorHandler)
