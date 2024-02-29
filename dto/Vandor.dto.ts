export interface CreateVandorInput{
    name:string;
    ownerName:string;
    foodType: [string];
    pincode:string;
    address:string;
    email:string;
    password:string;
    phone:string;
}

export interface VandorLoginInputs{
    email:string;
    password:string;
}

export interface ValidatePayload{
    _id:string;
    email:string;
    name:string;
    foodTypes:[string];
}
export interface updateVandor{
    name:string,
    foodTypes:[string];
    address:string;
    phone:string;
}