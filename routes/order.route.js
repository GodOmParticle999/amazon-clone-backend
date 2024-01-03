import Express from "express";
import placeOrder, { getOrders ,getOrder} from "../controllers/order.controller.js";

const orderRoute=Express.Router()

orderRoute.route("/placeOrder").post(placeOrder)

// add middleware to verify admin
orderRoute.route("/getOrders").get(getOrders)

orderRoute.route("/getOrder/:id").get(getOrder)

export default orderRoute