import express ,{Request,Response,NextFunction} from 'express';
import { GetVandorProfile, UpdateVandorProfile, UpdateVandorService, VandorLogin, addFood, getFood, updateVendorCoverImage } from '../controllers/VandorController';
import { Authenticate } from '../middlewares';
import multer from 'multer';


const router = express.Router();

const imageStorage = multer.diskStorage({
    destination: function(req,file, cb){
        cb(null, 'images')
    },
    filename: function(req,file,cb){
        cb(null, new Date().toISOString().replace(/:/g, '-')

        +'_'+file.originalname);
    }
})

const upload = multer({storage : imageStorage});


router.post('/login',VandorLogin);

router.use(Authenticate);

router.get('/profile',GetVandorProfile);

router.patch('/profile',UpdateVandorProfile);

router.patch('/service',UpdateVandorService);

router.get('/food',getFood);

router.post('/food',upload.array('images',10),addFood);

router.patch('/coverImage',upload.array('images',10),updateVendorCoverImage);


router.get('/',(req:Request,res:Response,next:NextFunction)=>{
    res.json({message:"Hiii from vandor"})
})


export { router as VandorRoute };