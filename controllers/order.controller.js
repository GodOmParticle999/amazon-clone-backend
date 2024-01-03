import { Order } from "../models/order.model.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

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

  try {
    const orderPlacedDetail = await Order.create({
      orderPrice,
      customer,
      orderedProducts,
    });
    return res
      .status(201)
      .json(
        new ApiResponse(201, orderPlacedDetail, "order placed successfully!")
      );
  } catch (error) {
    return next(new ApiError(500, "something went wrong while placing order!"));
  }
};
export default placeOrder;
