import mongoose,{Schema,Model,Document} from "mongoose";

export interface VanderDoc extends Document {
    name:string;
    ownerName:string;
    foodType: [string];
    pincode:string;
    address:string;
    email:string;
    password:string;
    phone:string;
    salt:string;
    serviceAvailable:boolean,
    coverImages:[string],
    rating:number,
    foods:any
}


const vandorSchema = new Schema({
    name:{
        type:String,
        required: true
    },
    ownerName:{
        type:String,
        required:true
    },
    foodType:{
        type:[String],
    },
    pincode:{
        type:String,
        required:true,
    },
    address:{
        type:String
    },
    phone:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    salt:{
        type:String,
        required:true
    },
    serviceAvailable:{
        type:Boolean,
    },
    coverImages:{
       type:[String]
    },
    rating:{
        type:Number
    },
    foods:[{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Food'
    }]

},{
    toJSON:{
        transform(doc,ret){
            delete ret.password;
            delete ret.salt;
            delete ret._v;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    },
    timestamps:true
})

const Vandor = mongoose.model<VanderDoc>('vandor',vandorSchema);

export { Vandor}