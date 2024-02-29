import express , {Request,Response,NextFunction} from 'express'

import {CreateCustomerInput, EditCustomerProfileInput, OrderInputs, UserLoginInput} from '../dto/Customer.dto'
import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator';
import { GeneratePassword, GenerateSalt, GenerateSignature, validatePassword } from '../utility/PasswordUtility';
import { Customer, Food, Order } from '../models';
import { GenerateOTP, onRequestOTP } from '../utility/NotificationUtility';
import { AuthPayload } from '../dto/Auth.dto';
import {v4 as uuidv4} from 'uuid';


export const CustomerSignup = async(req:Request,res:Response,next:NextFunction) =>{

    const CustomerInput = plainToClass(CreateCustomerInput,req.body);

    const inputErrors = await validate(CustomerInput,{validationError:{target:true}});

    if( inputErrors.length >0){
        return res.status(400).json({error:inputErrors})
    }

    const {phone,email,password} = CustomerInput;

    const existingCustomer = await Customer.findOne({email})
    if(existingCustomer !== null){
        return res.status(200).json({error:"User Already exist"});
    }

    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password,salt);

    const {otp,expiry} = await GenerateOTP();

    const result = await Customer.create({
        email:email,
        password:userPassword,
        salt:salt,
        otp:otp,
        otp_expiry:expiry,
        firstName:'',
        lastName:'',
        address:'',
        verified:false,
        lat:0,
        lng:0,
        phone:phone,
        orders:[]
    });

    console.log(result);

    if(result){

        await onRequestOTP(otp,phone);

        //send the otp

        //generate the signature 
        const signature = await GenerateSignature({
            _id:result._id,
            email:result.email,
            verified:result.verified
        })

        //send the result

        return res.status(201).json({
            signarure:signature,
            verified:result.verified,
            email:result.email
        })
    }
    res.status(400).json({error:"Internal Server Error"})

}

export const CustomerLogin = async (req:Request,res:Response,next:NextFunction) => {

    const loginInput = plainToClass(UserLoginInput,req.body);

    const loginErrors = await validate(loginInput,{validationError:{target:false}})

    if(loginErrors.length > 0){
       return res.status(400).json(loginErrors);
    }

    const {email,password} = loginInput;

    const customer = await Customer.findOne({email});

    if(customer){
        const validation = await validatePassword(password,customer.password,customer.salt);

        if(validation){

            const signature = GenerateSignature({
                _id : customer._id,
                email:customer.email,
                verified:customer.verified
            });

            return res.status(201).json({signature:signature,verfied:customer.verified,email:customer.email})
        }else{
            // password does not match
        }
    }

    return res.status(404).json({error:"Email and password combination is incorrect"})




}

export const CustomerVerify = async(req:Request,res:Response,next:NextFunction) => {

    const {otp} = req.body;
    const customer = req.user as AuthPayload;

    console.log(customer);

    if(customer){
        const profile = await Customer.findById(customer._id) ;

        if(profile){
            if(profile.otp === parseInt(otp) ){
                
                profile.verified = true;
                const updatedCustomerResponse = await profile.save();

                const signature =  GenerateSignature({
                    _id:updatedCustomerResponse._id,
                    email:updatedCustomerResponse.email,
                    verified:updatedCustomerResponse.verified
                })
        
        
                return res.status(201).json({
                    signarure:signature,
                    verified:updatedCustomerResponse.verified,
                    email:updatedCustomerResponse.email
                });

            }
        }
    }
    res.status(400).json({error:"Internal Server Error"})



}

export const RequestOtp = async (req:Request,res:Response,next:NextFunction) =>{
    const customer = req.user as AuthPayload;

    if(customer){
        const profile = await Customer.findById(customer._id);
        if(profile){
            const {otp,expiry} =  GenerateOTP();

            profile.otp = otp;
            profile.otp_expiry = expiry;

            await profile.save();
            await onRequestOTP(otp,profile.phone);
            res.status(200).json({message:"OTP sent to your registered phone number"});
        }
    }

    return res.status(400).json({message:"Error while requesting otp"});
}

export const GetCustomerProfile = async (req:Request,res:Response,next:NextFunction) =>{
    const customer = req.user as AuthPayload;
    
    if(customer){
        const profile = await Customer.findById(customer._id);
        return res.status(200).json({data:profile});
    }

    res.status(500).json({message:"Internal Server Error"});

}

export const EditCustomerProfile = async (req:Request,res:Response,next:NextFunction) =>{

    const customer = req.user as AuthPayload;

    const profileInputs = plainToClass(EditCustomerProfileInput, req.body);

    const profileError = await validate(profileInputs,{validationError:{target:false}});

    if(profileError.length >0){
        return res.status(400).json(profileError);
    }

    const {firstName,lastName,address} = profileInputs;
    if(customer){
        const profile = await Customer.findById(customer._id);
        if(profile){
            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;

            const result = await profile.save();

            return res.status(200).json({data:result});

        }

    }

    res.status(500).json({message:"Internal Server Error"});

}


export const CreateOrder = async (req:Request,res:Response,next:NextFunction) => {
// current user
    const customer = req.user as AuthPayload;

    //create an order ID
    if(customer){
        const orderId = uuidv4();

        const profile = await Customer.findById(customer._id);

        const cart = <[OrderInputs]>req.body;

        let cartItems = Array();

        let netAmount = 0.0;

        //calculate the order

        const foods = await Food.find().where('_id').in(cart.map(item => item._id)).exec();

        foods.map(food =>{
            cart.map(({_id,unit}) =>{

                if(food._id == _id){
                    netAmount += (food.price * unit);
                    cartItems.push({food,unit})
                }
                
            })
        })

        if(cartItems){
            //create order

            const currentOrder = await Order.create({
                orderId:orderId,
                items:cartItems,
                totalAmount:netAmount,
                orderDate:new Date(),
                paidThrough:'COD',
                payementResponse:'',
                orderStatus:'Waiting'
            });

            if(currentOrder){
                profile.orders.push(currentOrder);
                const profileResponse = await profile.save();

                return res.status(200).json({data:currentOrder});
            }
        }
        

    }

    res.status(500).json({message:"Internal Server Error"});

}

export const GetOrders = async (req:Request,res:Response,next:NextFunction) =>{

    const user = req.user as AuthPayload;

    if(user){
        const profile = await Customer.findById(user._id).populate('orders');

        if(profile){
            return res.status(200).send({data:profile})
        }
    }
    res.status(500).json({message:"Internal Server Error"});

}

export const GetOrderById = async (req:Request,res:Response,next:NextFunction) =>{
    const orderId = req.params.id;

    if(orderId){
        const order = await Order.findById(orderId).populate('items.food');
        return res.status(200).json({data:order})
    }
    res.status(500).json({message:"Internal Server Error"});

}

export const GetCart = async (req:Request,res:Response,next:NextFunction) =>{
}

export const AddToCart = async (req:Request,res:Response,next:NextFunction) =>{

    const customer = req.user as AuthPayload;

    if(customer){
        const profile = await Customer.findById(customer._id);
        let cartItems = Array();
        const {_id,unit} = <OrderInputs> req.body;

        const food = await Food.findById(_id);

        if(food){
            if(profile != null){
                cartItems = profile.cart;
                if(cartItems.length > 0){
                    //check and update unit
                    

                }else{
                    //add new item to cart
                    cartItems.push({food,unit})
                }
            }  
        }

    
    }
    res.status(500).json({message:"Internal Server Error"});

}

export const DeleteCart = async (req:Request,res:Response,next:NextFunction) =>{
}





