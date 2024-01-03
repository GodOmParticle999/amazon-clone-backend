import Express from "express";
import placeOrder from "../controllers/order.controller.js";

const orderRoute=Express.Router()

orderRoute.route("/placeOrder").post(placeOrder)



export default orderRoute