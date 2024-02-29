import express,{ Request,Response,NextFunction } from "express";
import { FoodDoc, VanderDoc, Vandor } from "../models";

export const GetFoodAvailablity = async(req:Request,res:Response,next:NextFunction) =>{

    const pincode = req.params.pincode;

    const result = await Vandor.find({pincode:pincode,serviceAvailable:true}).sort([['rating','descending']]).populate("foods");


    if(result.length >0){
        return res.status(200).json({data:result});
    }

    return res.status(400).json({error:"Data not Found"});
    
}


export const GetTopRestaurant = async(req:Request,res:Response,next:NextFunction) =>{

    const pincode = req.params.pincode;

    const result = await Vandor.find({pincode:pincode,serviceAvailable:true}).sort([['rating','descending']]).limit(10);

    if(result.length>0){
        return res.status(200).json({data:result})
    }

    return res.status(400).json({error:"No data found"});
}


export const GetFoodIn30Min = async(req:Request,res:Response,next:NextFunction) =>{

    const pincode = req.params.pincode;

    const result = await Vandor.find({pincode:pincode,serviceAvailable:true}).sort([['rating','descending']]).populate('foods');

    const foodResults = result.map((vendor:VanderDoc) => vendor.foods.filter((food:FoodDoc) => food.readyTime <= 30));


    if(result.length>0){
        return res.status(200).json({data:foodResults});
    }
    return res.status(400).json({error:"No data found"});

}
export const SearchFoods = async(req:Request,res:Response,next:NextFunction) =>{
    const pincode = req.params.pincode;

    const result = await Vandor.find({pincode:pincode}).sort([['rating','descending']]).populate("foods");


    if(result.length >0){
        let foodResult:any = [];
        result.map(item => foodResult.push(...item.foods))
        return res.status(200).json({data:foodResult});
    }

    return res.status(400).json({error:"Data not Found"});
    

}
export const RestaurantById = async(req:Request,res:Response,next:NextFunction) =>{

    const id = req.params.id;

    const result = await Vandor.findById(id).populate('foods');

    if(result!==null){
        return   res.status(200).json({result});
    }
    return res.status(400).json({error:"Data not found"});

}