import type { Request, Response, NextFunction } from 'express'; 
import { initializedRedisClient } from '../utils/client';
import { resturantKeyById } from '../utils/keys';
import {  errorResponse } from '../utils/response';

export const checkRestaurantId = async (req: Request, res: Response, next: NextFunction) => {
    const  {restaurantId } = req.params;
    if (!restaurantId) {
        return errorResponse(res, 400, 'Restaurant ID is required');
    }

    const client = await initializedRedisClient();
    const restaurantKey = resturantKeyById(restaurantId);
    const exists = await client.exists(restaurantKey);
    if (!exists) {
        return errorResponse(res, 404, `Restaurant with ID ${restaurantId} not found`);
    } 

    next();
}