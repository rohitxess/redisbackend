
// defining the routes for restaurants

import express from 'express';
import { validate } from '../middlewares/validate';
import { ResturantSchema } from '../schemas/resturant';
const router = express.Router();

router.post('/', validate(ResturantSchema), async (res, req) => {
    const data = req.body as Restaurant 
    res.send('List of restaurants');
})

export default router;