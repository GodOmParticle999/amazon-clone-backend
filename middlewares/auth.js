import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"

export const verifyJWT=async(req,_,next)=>{
    // get token from cookies
    const token=req.cookies.access_token
    if(!token) return next(new ApiError(401,"unauthorized access! Login first!!"))

    const decodedToken=jwt.verify(token,process.env.JWT_SECRET_KEY)
   try {
    const user=await User.findById(decodedToken.id).select("-password ")
    if(!user) return next(new ApiError(401,"invalid access token!"))
    
    // bind this user to req to be access further 
    req.user=user
    next()
   } catch (error) {
    return next(new ApiError(401,error?.message||"invalid access token!"))
   }
    
  
}
//  to verify admin

export const verifyAdmin=(req,_,next)=>{
    verifyJWT(req,_,next,()=>{
        // pass the isAdmin in payload while logging in
        if(req.user.isAdmin){
          next()
        }else{
            return next(new ApiError(403,"you're not authorized"))
        }
    })
}