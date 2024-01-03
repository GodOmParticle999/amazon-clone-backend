import  Express  from "express";
import { registerUser, getUsers, loginUser } from "../controllers/user.controller.js";


const userRoute=Express.Router()


userRoute.route("/register").post(registerUser)

userRoute.route("/getUsers").get(getUsers)

userRoute.route("/login").post(loginUser)



export default userRoute