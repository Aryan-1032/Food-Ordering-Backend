import {Request,Response,NextFunction} from 'express';
import { VandorLoginInputs, updateVandor } from '../dto';
import { FindVandor } from './AdminController';
import { GenerateSignature, validatePassword } from '../utility/PasswordUtility';
import { AuthPayload } from '../dto/Auth.dto';
import { CreateFoodInputs } from '../dto/Food.dto';
import { Food } from '../models';

export const VandorLogin = async(req:Request,res:Response,next:NextFunction) =>{
    const {email,password} = <VandorLoginInputs>req.body;
    
    const existingVandor = await FindVandor('',email);




    if(existingVandor === null){
        return res.json({error:"Vandor doesn't exist with email"})
    }
     
    const validUser = await validatePassword(password,existingVandor!.password,existingVandor!.salt);
    const jwtToken = GenerateSignature({
        _id:existingVandor._id,
        name:existingVandor.name,
        email:existingVandor.email,
        foodTypes:existingVandor.foodType
    });


    if(validUser){
        return res.json({msg:"Login Successfull",token:jwtToken})
    }
    return res.json({error:"Email and password are incorrect"});

}

export const GetVandorProfile = async(req:Request,res:Response,next:NextFunction) =>{

    const user = req.user as AuthPayload;
    console.log(user);

    if(user){
        const existingUser = await FindVandor(user._id);
        return res.json({data:existingUser});
    }
    return res.json({error:"Not Found"});

}

export const UpdateVandorProfile = async(req:Request,res:Response,next:NextFunction) =>{
    const {foodTypes,name,phone,address} = req.body as updateVandor;

    const user = req.user as AuthPayload;
    if(user){
        const existingVendor = await FindVandor(user._id);
        if(existingVendor){
            existingVendor.name = name;
            existingVendor.phone = phone;
            existingVendor.address = address;
            existingVendor.foodType = foodTypes;
            const saveResult = await existingVendor.save();
            return res.json({updatedData:saveResult});
        }
    }
    return res.json({Error:"User Not Found"});
    
}

export const UpdateVandorService = async(req:Request,res:Response,next:NextFunction) =>{

    const user = req.user as AuthPayload;
    if(user){
        const existingUser = await FindVandor(user._id);
        if(existingUser){
            existingUser.serviceAvailable = !existingUser.serviceAvailable;
            const updatedUser = await existingUser.save();
            return res.json({updatedData:updatedUser});
        }
        return res.json({Error:"User not found"});
    }
}

export const addFood = async(req:Request,res:Response,next:NextFunction) =>{
    console.log(req.files);

    const user = req.user as AuthPayload;
    if(user){

        const files = req.files as [Express.Multer.File];

        const images = files.map((file:Express.Multer.File) => file.filename)
        
        const {name,description,category,foodType,readyTime,price} =<CreateFoodInputs> req.body;
        const vandor = await FindVandor(user._id);
        if(vandor !== null){
            const createdFood = await Food.create({
                vandorId:vandor._id,
                name:name,
                description:description,
                category:category,
                foodType:foodType,
                readyTime:readyTime,
                price:price,
                rating:0,
                images:images
            });
            
            vandor.foods.push(createdFood);

            const result = await vandor.save();

            return res.json({msg:result});
        }
    }
    return res.json({error:"No user Found"});
}

export const getFood = async(req:Request,res:Response,next:NextFunction) =>{
    const user = req.user as AuthPayload;
    if(user){

        const foods =await Food.find({vandorId:user._id});
        if(foods !== null){
            return res.json({data:foods});
        }
    
    }
    return res.json({error:"No user Found"});
}

export const updateVendorCoverImage = async(req:Request,res:Response,next:NextFunction) =>{
    
    const user = req.user as AuthPayload;
    
    if(user){

        const vandor = await FindVandor(user._id);

        if(vandor){
            
            const files = req.files as [Express.Multer.File];

            const images = files.map((file:Express.Multer.File) => file.filename)

            vandor.coverImages.push(...images);
            
            const result = await vandor.save();

            return res.json({data:result});

        }
    }

}