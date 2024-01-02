import dotenv from "dotenv"
import  Express  from "express"

import cors from "cors"
import userRouter from "./routes/user.route.js"
import dbConnect from "./db/db.js"
import errorHandler from "./middlewares/errorHandler.js"
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

app.use(cors())

app.use(Express.json())

app.use("/user",userRouter)

app.use(errorHandler)
