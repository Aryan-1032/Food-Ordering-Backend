
import mongoose from "mongoose";
import { MONGO_URI } from "../config";


export default async() =>{
    try{
         mongoose.connect(MONGO_URI).then(result =>{
            console.log("Connected to DB")
        }).catch(err =>{
            console.log(err);
        });
    }catch(e){
        console.log(e);
    }
}



