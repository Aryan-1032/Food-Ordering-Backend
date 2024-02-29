import {Request,Response,NextFunction} from 'express'
import { AuthPayload } from '../dto/Auth.dto'
import { validateSignature } from '../utility/PasswordUtility'

// declare global{
//     namespace Express{
//          export interface Request{
//             user?:AuthPayload
//         }
//     }
// }

export const Authenticate = async(req:Request,res:Response,next:NextFunction) => {
    const validate = await validateSignature(req);
    if(validate){
        next();
    }else{
        return res.json({Error:"Invalid Token"});
    }
}
