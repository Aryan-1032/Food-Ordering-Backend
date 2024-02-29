import express ,{Request,Response,NextFunction} from 'express';
import { CreateVandor, GetVandor, GetVandorByID } from '../controllers/AdminController';


const router = express.Router();



router.post('/vandor',CreateVandor);
router.get('/vandor',GetVandor);
router.get('/vandor/:id',GetVandorByID);



router.get('/',(req:Request,res:Response,next:NextFunction)=>{
    res.json({message:"Hiii from admin"})
})


export { router as AdminRoute };