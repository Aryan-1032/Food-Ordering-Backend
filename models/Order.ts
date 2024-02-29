import mongoose from "mongoose";
import mpngoose,{ Schema,Document } from "mongoose";

export interface OrderDoc extends Document{

    orderId:string,
    items:[any],
    totalAmount:number,
    orderDate:Date,
    paidThrough:string,
    payementResponse:string,
    orderStatus:string,
}

const OrderSchema = new Schema({

    orderId:{type:String,required:true},
    items:[
        {
            food:{
                type:Schema.Types.ObjectId,
                ref:"Food",
                required:true
            },
            unit:{
                type:Number,
                required:true
            }
        }
    ],
    totalAmount:{
        type:Number,
        required:true
    },
    orderDate:{
        type:Date
    },
    paidThrough:{
        type:String
    },
    paymentResponse:{
        type:Date
    },
    orderStatus:{
        type:String
    }


},{
    toJSON:{
        transform(doc,ret){
            delete ret.__v,
            delete ret.createdAt,
            delete ret.updatedAt
        }
    },
    timestamps:true
});

const Order = mongoose.model<OrderDoc>('Order',OrderSchema);

export {Order};