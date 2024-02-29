import { Request,Response,NextFunction } from "express"
import { CreateVandorInput } from "../dto";
import { Vandor } from "../models";
import { GeneratePassword, GenerateSalt } from "../utility/PasswordUtility";

export const FindVandor = async(id:string | undefined, email?:string) =>{
    if(email){
        const vandor = await Vandor.findOne({email});
        return vandor;
    }else{
        const vandors = await Vandor.findById(id);
        return vandors;
    }
}

export const  CreateVandor = async(req:Request,res:Response,next:NextFunction) =>{
    const {name,address,pincode,foodType,email,password,ownerName,phone} = <CreateVandorInput>req.body;

    const validUser = await FindVandor('',email);

    //check if user is already present or not
    if(validUser !== null){
        return res.json({"error":"Vandor already exists"});
    }

    
    // generate a salt
    const salt = await GenerateSalt();

    // encrypt the password using the salt
    const userPassword = await GeneratePassword(password,salt);

    
    const createdVandor = await Vandor.create({
        name,address,pincode,foodType,email,password:userPassword,ownerName,phone,
        salt,rating:0,serviceAvailable:false,coverImages:[],foods:[]
    });

    res.json({ msg:"new vandor created",data:createdVandor});

}

export const  GetVandor = async(req:Request,res:Response,next:NextFunction) =>{
    const vandors = await Vandor.find();

    if(vandors == null){
        return res.json({error:"No vandors Found"});
    }

    res.json({ msg:"fetching all vandor ",data:vandors});

}

export const  GetVandorByID = async(req:Request,res:Response,next:NextFunction) =>{

    const id = req.params.id;
    if(id == null){
        return res.json({error:"id is empty"});
    }

    const vandorData = await FindVandor(id,'');

    res.json({msg:`Successfully Fetched Data`,data:vandorData});
}