import express,{Request,Response,NextFunction} from 'express'
import { AddToCart, CreateOrder, CustomerLogin, CustomerSignup, CustomerVerify, DeleteCart, EditCustomerProfile, GetCart, GetCustomerProfile, GetOrderById, GetOrders, RequestOtp } from '../controllers/CustomerController';
import { Authenticate } from '../middlewares';

const router = express.Router();

router.post('/signup',CustomerSignup);

router.post('/login',CustomerLogin);

router.use(Authenticate);

router.patch('/verify',CustomerVerify);

router.get('/otp',RequestOtp);

router.get('/profile',GetCustomerProfile)

router.patch('/profile',EditCustomerProfile)


//order

router.post('/create-order',CreateOrder);

router.get('/orders',GetOrders);

router.get('/order/:id',GetOrderById);

//cart

router.get('/cart',GetCart)

router.post('/cart',AddToCart)

router.delete('/cart',DeleteCart);







export { router as CustomerRoute };