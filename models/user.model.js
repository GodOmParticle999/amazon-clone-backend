import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt"

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:[true,"Please enter email"],
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:[6,"at least 6 character is required"]
    },
    phoneNumber:{
        type:String,
        match:[/^[6-9]\d{9}$/,"Please enter a valid phone number"]
    },
    
    isAdmin:{
         type:Boolean,
         default:false
    },
    orderHistory:[
       {
         type:mongoose.Schema.Types.ObjectId,
        ref:"Order"
    },
   
    ]


},
{
    timestamps:true
}
)


// to encrypt password while modifying the password or before saving for the first time 
userSchema.pre("save",async function (next){
  if(!this.isModified("password")) return next()
  this.password=bcrypt.hashSync(this.password,10)
  next()
 
})
// adding a method to validate password while logging in
userSchema.methods.isPasswordCorrect= function (password){
        return  bcrypt.compareSync(password,this.password)
}

// adding a method to this schema to generate jwt token
userSchema.methods.generateJWTaccessToken=function (){
    return jwt.sign({
        id:this._id,
        email:this.email,
        
        name:this.name
    },process.env.JWT_SECRET_KEY)
}

export const User=mongoose.model("User",userSchema)
 
