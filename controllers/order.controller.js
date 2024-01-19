import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt  from "jsonwebtoken";

const placeOrder = async (req, res, next) => {
  // CUSTOMER FIELD CAN BE EXTRACTED FROM REQ.COOKIES / REQ.user
  const { orderPrice, customer, orderedProducts } = req.body;
  //  get current logged in user that'll be used for two purpose

  //  COMING FROM MIDDLEWARE
  const customerId = req.user._id 
  if(!customerId) return next(new ApiError(404,"unauthorized access! please login first!!"))
  // extract / decode here later
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

  const newOrder = new Order({
    orderPrice,
    customer,
    orderedProducts,
  });
  if(newOrder){
  // Save the new order to the database
  newOrder.save().then(async(savedOrder)=>{
    
    try {
          // Push the orderId of the newly created order into the orderHistory field of the user schema
         const insertedData=await User.findOneAndUpdate(
            {_id:customerId},
           { $push: { orderHistory: savedOrder._id } },
           { new: true })
           if (!insertedData) {
             return next(new ApiError(500,"something went wrong while placing order"))
            } else {
              return res.status(201).json(new ApiResponse(201,savedOrder,"ordered successfully!"));
            }
        }
          
     catch (error) {
      return next(new ApiError(500,"something went wrong while getting current user data"))
    }
  }).catch((error)=>{
     return next (new ApiError(500,error))
  })

 
 
}     
}      
      


// get all orders 
// add middleware to authenticate that user should be the admin
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

// get all orders of currently logged in user
export const getOrder=async(req,res,next)=>{
  // get userId from cookies or url 
  //  const {id}=req.params
  const id=req.user._id 
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


export const cancelOrder=async(req,_,next)=>{
        const {id} =req.params
          
        if(!id) return next(new ApiError(404,"Order Id not found !"))

       try {
         const response=await Order.findByIdAndUpdate({_id:id},{orderStatus:"CANCELLED"})
         if(response) return res.status(200).json(new ApiResponse(200,response,"Your order cancelled successfully!"))
         return next(new ApiError(500,"Order couldn't be cancelled !"))
       } catch (error) {
        return next(new ApiError(500,error))
       }
}
export default placeOrder
