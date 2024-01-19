import mongoose from "mongoose";

const orderSchema=new mongoose.Schema({
    orderPrice:{
        type:Number,
        required:true
    },
    orderStatus:{
        type:String,
        enum:['PENDING','PROCESSING','SHIPPED','OUT FOR DELIVERY','DELIVERED','CANCELLED'],
        default:'PENDING'
    }
    ,
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
            productName:{
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

// orderSchema.post("save",async function(next){
//     console.log(this)
//     this._id
//    return next()
// })

export const Order=mongoose.model("Order",orderSchema)
