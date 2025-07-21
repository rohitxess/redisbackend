
// defining the routes for restaurants

import express, {type Request} from 'express';
import { validate } from '../middlewares/validate.js';
import { ResturantSchema, type Resturant } from '../schemas/resturant';
import { initializedRedisClient } from '../utils/client';
import { nanoid, success } from 'zod';
import { resturantKeyById } from '../utils/keys';
import { successResponse } from '../utils/response';

const router = express.Router();

router.post('/', validate(ResturantSchema), async (res, req) => {
    const data = req.body as Restaurant;
    try{
        const client = await initializedRedisClient();
        const resturantKey = resturantKeyById(restaurantId);
        const hashdata = {id, name: data.name, location: data.location};
        const addResult = await client.hSet(resturantKey, hashdata);

        return successResponse(res, hashData, 'Added new restaurant');

    } catch(error){
        next(error);
    }
 ;
})

router.get('/:resturantId', async (req: Request< resturantID: string>, res, next) => {   

    const  {resturantId } = req.params;
    try{
        const client = await initializedRedisClient();
        const restaurantKey = resturantKeyById(resturantId);
        const [viewCount, restaurant] = await Promise.all([client.hIncrBy(restaurantKey, 'viewCount', 1), client.hGetAll(restaurantKey)]);
        return successResponse(res, restaurant);
    } catch(error) {
        next(error);
    }   
});

export default router;