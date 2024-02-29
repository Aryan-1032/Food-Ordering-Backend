import express ,{} from 'express'
import { GetFoodAvailablity, GetFoodIn30Min, GetTopRestaurant, RestaurantById, SearchFoods } from '../controllers';


const router = express.Router();

//Food Availability
router.get('/:pincode',GetFoodAvailablity);

//Top restaurant
router.get('/top-restaurant/:pincode',GetTopRestaurant)

// food avaiable in 30 min
router.get('/food-in-30-min/:pincode',GetFoodIn30Min)

//search food
router.get('/search/:pincode',SearchFoods)

//find restaurant by Id
router.get('/restaurant/:id',RestaurantById)


export {router as ShoppingRoute};