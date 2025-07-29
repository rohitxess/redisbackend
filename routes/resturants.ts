
// defining the routes for restaurants

import express, {type Request} from 'express';
import { validate } from '../middlewares/validate.js';
import { ResturantSchema, type Resturant } from '../schemas/resturant';
import { initializedRedisClient } from '../utils/client';
import { nanoid, success } from 'zod';
import { resturantKeyById } from '../utils/keys';
import { successResponse } from '../utils/response';
import { checkRestaurantId } from '../middlewares/checkRestaurantId.js';
import { Review } from '../schemas/review.js';
import { UNSAFE_ErrorResponseImpl } from 'react-router-dom';

const router = express.Router();

router.post('/', validate(ResturantSchema), async (res, req, next) => {
    const data = req.body as Restaurant;

    try{
        const client = await initializedRedisClient();
        const id = nanoid();
        const resturantKey = resturantKeyById(id);
        const hashdata = {id, name: data.name, location: data.location};

        await Promise.all[
            ...data.cuisines.map((cuisine) => Promise.all([
                client.sAdd(cuisinesKey, cuisine),
                client.sAdd(cuisineKey(cuisine), id),
                client.sAdd(restaurantCuisinesKeyById(id), cuisine)
            ])),
            client.hSet(resturantKey, hashdata);
            client.zAdd(restarurantByRatingKey,{
                score: 0,
                value: id,
            })

        return successResponse(res, hashData, 'Added new restaurant');

    } catch(error){
        next(error);
    }
 ;
})


router.get('/:resturantId', checkRestaurantExists, async (req: Request< resturantID: string>, res, next) => {   

    const  {resturantId } = req.params;
    try{
        const client = await initializedRedisClient();
        const restaurantKey = resturantKeyById(resturantId);
        const [viewCount, restaurant, cuisines] = await Promise.all([
            client.hIncrBy(restaurantKey, 'viewCount', 1),
            client.hGetAll(restaurantKey)],
            client.sMembers(restaurantCuisinesKeyById(resturantId)),
        ); 
        return successResponse(res, { ...restaurant, cuisines });
    } catch(error) {
        next(error);
    }   
});


router.post('/:restaurantId/reviews', checkRestaurantExisit, validate(ReviewSchema), async(req: Request<restuaurantId: string>, res, next) => {
    const { restaurantId } = req.params;
    const data = req.body as Review;
    try{
        const client = await initializedRedisClient();
        const reviewId = nanoid();
        const reviewKey = reviewById(reviewId); 
        const reviewDetailsKey = reviewDeatilsKeyById(reviewId);
        const reviewData = {
            id: reviewId, 
            ...data, 
            timestamp: Date.now(),
            restaurantId, 
        };
        // this will store the review id in the list of reviews for the restaurant
       const [] = await Promise.all([
            client.lPush(reviewKey, reviewId),
            client.hSet(reviewDetailsKey, reviewData),
        ])
    }catch(error){
        next(error);
    }
})

// get endpoint to get all the reviews for a restaurant after checking if the restaurant exists

router.get('/:restaurantId/reviews', checkRestaurantExisit, async (req: Request<{restaurantId: string}>, res, next) => {
    const { restaurantId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const start = (Number(page) - 1) * Number(limit);
    const end = start + Number((limit) - 1);
    
    try{
        const client = await initializedRedisClient();
        const reviewKey = reviewById(restaurantId);
        const reviewIds = await client.lRange(reviewKey, start, end);
        const reviews = await Promise.all(reviewIds.map(id) => client.hGetAll(reviewDeatilsKeyById(id)));
    }catch(error) {
        next(error);
    }


})

// delete end point, check if the restaurant exists, then delete the review

router.delete('/:restaurantId/reviews/:reviewId', checkRestaurantExisit, async (req: Request<{restaurantId: string, reviewId: string}>, res, next) => {
    const { restaurantId, reviewId } = req.params;
    const reviewKey = reviewById(restaurantId);

    try{
        const client = await initializedRedisClient();
        const reviewKey = reviewById(restaurantId);
        const reviewDetailsKey = reviewDeatilsKeyById(reviewId); 
        const [ removeResult, deleteResult ] = await Promise.all([
            client.LRANGE(reviewKey, 0, reviewId),  
            client.del(reviewDetailsKey)
        ])  

        if (removeResult === 0 && deleteResult === 0){
            return UNSAFE_ErrorResponseImpl(res, 404, 'Review not found');
        }
        return successResponse(res, reviewId, 'Review deleted successfully');   

    }catch(error) {
        next(error);
    }
})

// get endpoint to get a restaurant by id, check if the restaurant exists, then increment the view count and return the restaurant details



export default router;