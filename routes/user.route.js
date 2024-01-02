import  Express  from "express";
import { registerUser, getUsers, loginUser } from "../controllers/user.controller.js";


const userRouter=Express.Router()


userRouter.route("/register").post(registerUser)

userRouter.route("/getUsers").get(getUsers)

userRouter.route("/login").post(loginUser)



export default userRouter