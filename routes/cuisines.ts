
// defining the routes for cuisines 
import express from 'express';
import { initializedRedisClient } from '../utils/client.js';
import { cuisinesKey } from '../utils/keys';
import { successResponse } from '../utils/response.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
    try{
        const client = await initializedRedisClient();
        const cuisines = await client.sMembers('cuisines');
        return success(res, cuisines);

    }catch(error) {
        next(error);
    }
})

router.get('/:cuisine', async (req, res, next) => {
    const { cuisine } = req.params;
    try {
        const client = await initializedRedisClient();
        const restaurantIds = await client.sMembers(cuisinesKey(cuisine)); // this will return all the restaurant id with that specific cuisine 
        const restaurants = await Promise.all(restaurantIds.map(id) => client.hGet(restaurantKeyById(id)),  'name');

        return successResponse(res, restaurant)
    }
})

export default router;