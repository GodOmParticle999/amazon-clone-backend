import Express from "express";
import placeOrder, { getOrders ,getOrder} from "../controllers/order.controller.js";
import { verifyAdmin, verifyJWT } from "../middlewares/auth.js";

const orderRoute=Express.Router()

orderRoute.route("/placeOrder").post(verifyJWT ,placeOrder)

// add middleware to verify admin
orderRoute.route("/getOrders").get(verifyAdmin,getOrders)

orderRoute.route("/getOrder/:id").get(getOrder)

export default orderRoute