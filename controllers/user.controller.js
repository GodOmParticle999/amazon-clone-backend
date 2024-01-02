import { compareSync, hashSync } from "bcrypt";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { excludePassword } from "../utils/excludePassword.js";


// register user
const registerUser = async (req, res, next) => {
  const { name, email, password, phoneNumber } = req.body;

  if (![name, email, password].some((field) => field?.trim() === "")) {
    // check for valid email 
    const validEmail=RegExp(/^[a-zA-Z0-9.+-_%]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(email)
    if(!validEmail) return next(new ApiError(400,'invalid email address!'))
    // check for valid password
    if (password.length < 6)
      return next(new ApiError(400, "Password must be atleast 6 characters"));

      // verify if phoneNumber is valid or not and it must be indian phone number
      
      if(phoneNumber){
       const validPhone=RegExp(/^[6-9]\d{9}$/).test(phoneNumber)
       if(!validPhone) return next(new ApiError(400,"Please enter valid Indian Phone number"))
      }

    //  find if user with this email already exists or not
    const userExists = await User.findOne({ email });

    if (!userExists) {
      // encrypt password

      // const hashedPassword = hashSync(password, 10);   no need for this line as we are already using 
      // pre middleware to handle this 

      try {
        // creating user in mongoDb
        const newUser = await User.create({
          name,
          email,
          password,
          phoneNumber,
        })

        // send created user without password field

       return res
          .status(201)
          .json(
            new ApiResponse(201, excludePassword(newUser), "User Created Successfully!")
          );
      } catch (error) {
        return next(new ApiError(500, "Internal Server Error! Try Again!!"));
      }
    } else {
      return next(new ApiError(409, "User with this email already exists!"));
    }
  } else {
    return next(new ApiError(400, "All fields are required!"));
  }
};
// login User
const loginUser = async (req, res, next) => {
  // get data from client side 
  const { email, password } = req.body;

  if (!email || !password)
    return next(new ApiError(400, "email and password is required"));

  try {
    const user = await User.findOne({ email });
    if (!user) return next(new ApiError(400, "wrong credentials!"));
    //  user exists then match password using custom method
    const isPasswordCorrect = user.isPasswordCorrect(password);

    if (!isPasswordCorrect)
      return next(new ApiError(400, "wrong username or password!"));

    //  generating jwt access token
   const token=user.generateJWTaccessToken()

    return res
      .status(200)
      .cookie("access_token",token)
      .json(new ApiResponse(200, excludePassword(user), "logged in successfully!"));
  } catch (error) {
    return next(new ApiError(500, "internal server down! Please try again!"));
  }
};
// get all users
// make this secured 
const getUsers = async (_, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server down",
    });
  }
};

export { registerUser, getUsers, loginUser };
