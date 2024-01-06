import  Express  from "express";
import { registerUser, getUsers, loginUser, logOut } from "../controllers/user.controller.js";
import { verifyAdmin, verifyJWT } from "../middlewares/auth.js";


const userRoute=Express.Router()


userRoute.route("/register").post(registerUser)

userRoute.route("/getUsers").get(verifyAdmin,getUsers)

userRoute.route("/login").post(loginUser)

userRoute.route("/logout").post(verifyJWT,logOut)

export default userRoute