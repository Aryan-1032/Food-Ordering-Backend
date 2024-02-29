//Email
//notification
//otp
export const GenerateOTP = () =>{
    const otp = Math.floor(Math.random() * 900000 + 100000);
    let expiry = new Date();
    expiry.setTime(new Date().getTime() + (30 * 60 * 1000))

    return {
        otp,expiry
    }
}

export const onRequestOTP = async(otp:number, to:string) => {

    const accountSid = "ACf2c5a0babdd068cd50d6f087a808d45b";
    const authToken = "a61e761a0a0cb3aaaa5f914ef73a65bf";
    const client = require('twilio')(accountSid, authToken);
    
    const response = await client.messages.create({
        body: `Your OTP is ${otp}`,
        from:'+12513336224',
        to:`+91${to}`
    });
    
    return response;

}