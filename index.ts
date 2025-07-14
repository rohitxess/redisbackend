import express from 'express';
import cuisinesRouter from './routes/cuisines.js';
import resturantsRouter from './routes/resturants.js';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use('/cuisines', cuisinesRouter);
app.use('/restaurants', resturantsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})
.on('errror', (err: any) =>{
    throw new Error(err.message);  
})
