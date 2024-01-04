import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Jwt } from "jsonwebtoken";

const placeOrder = async (req, res, next) => {
  const { orderPrice, customer, orderedProducts } = req.body;

  // this function is needed to fix the insertion of empty object into the array
  const isOrderedProductsEmpty=(orderedProducts)=>{
   const arr=orderedProducts.map((obj)=>Object.keys(obj).length!==0)
   return arr.includes(false)
  }


// if there is an insertion of empty object throw error
if( isOrderedProductsEmpty(orderedProducts))
return next(new ApiError(400, "ordered products can not be empty!"));

// all fields must be present
  if (!customer || !orderPrice )
    return next(new ApiError(400, "all the order information is required!"));

  // try {
  //   const orderPlacedDetail = await Order.create({
  //     orderPrice,
  //     customer,
  //     orderedProducts,
  //   });
  //   return res
  //     .status(201)
  //     .json(
  //       new ApiResponse(201, orderPlacedDetail, "order placed successfully!")
  //     );
  // } catch (error) {
  //   return next(new ApiError(500, "something went wrong while placing order!"));
  // }
  const newOrder = new Order({
    orderPrice,
    customer,
    orderedProducts,
  });
  if(newOrder){
  // Save the new order to the database
  await newOrder.save()

  const token=req.cookies.access_token
try {
    const currentUser=jwt.verify(token,process.env.JWT_SECRET_KEY)
    if(!currentUser) return next(new ApiError(401,"invalid access token"))

      // Push the orderId of the newly created order into the orderHistory field of the user schema
     const insertedData=await User.findOneAndUpdate(
        {_id:currentUser._id},
       { $push: { orderHistory: newOrder._id } },
       { new: true })
       if (!insertedData) {
         return next(new ApiError(500,"something went wrong while placing order"))
        } else {
          return res.status(201).json(new ApiResponse(201,newOrder,"ordered successfully!"));
        }
    }
      
 catch (error) {
  return next(new ApiError(500,"something went wrong while getting current user data"))
}
 
}     
        
      


// get all orders 
// add middleware to authenticate that user should the logged in one or should be the admin
export const getOrders =async(_,res,next)=>{

try {
   const allOrders=await Order.find({})
    return res.status(200).json(
      new ApiResponse(200,allOrders,"all orders are fetched successfully!")
    )
} catch (error) {
  return next(new ApiError(500,"orders couldn't be fetched! try again later!"))
}
}
export const getOrder=async(req,res,next)=>{
  // get userId from cookies or url 
   const {id}=req.params
  try {
    const myOrders=await Order.find({customer:id})

    // if customer id is invalid somehow then the response will return empty but successful response
    if(myOrders.length>0){
     return res.status(200).json(new ApiResponse(200,myOrders,"Your all orders are here"))
    }else{
      return next(new ApiError(404,"orders for this customer is not found"))
    }
    }
    
   catch (error) {
    return next(new ApiError(500,"Your orders couldn't be fetched right now! try again"))
  }
}
export default placeOrder;
