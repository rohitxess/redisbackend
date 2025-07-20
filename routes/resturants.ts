
// defining the routes for restaurants

import express from 'express';
import { validate } from '../middlewares/validate';
import { ResturantSchema } from '../schemas/resturant';
import { initializedRedisClient } from '../utils/client';

const router = express.Router();

router.post('/', validate(ResturantSchema), async (res, req) => {
    const data = req.body as Restaurant 
    const client = await initializedRedisClient();
    res.send('List of restaurants');
})

export default router;