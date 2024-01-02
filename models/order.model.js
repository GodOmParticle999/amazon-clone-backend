import mongoose from "mongoose";

const orderSchema=new mongoose.Schema({
    orderPrice:{
        type:Number,
        required:true
    },
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    orderedProducts:[
        {
            productId:{
              type:String,
              required:true
            },
            quantity:{
                type:Number,
                default:1
            }
        }
    ]

},
{
    timestamps:true
}
)

export const Order=mongoose.model("Order",orderSchema)
