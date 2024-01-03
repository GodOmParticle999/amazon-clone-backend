import { Order } from "../models/order.model.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const placeOrder = async (req, res, next) => {
  const { orderPrice, customer, orderedProducts } = req.body;

  if (!customer || !orderPrice || orderedProducts?.length < 1)
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
