//-> major releases -> Api -> v1 , v2

import express from 'express';
import dotenv from 'dotenv';
import configureCors from './src/config/corsConfig';
import {addTimeStamp, requestLogger} from './src/middleware/customMiddleware.js';
import { globalErrorhandler } from './src/middleware/errorHandler.js';

dotenv.config();

const app = express();

const PORT  =  process.env.PORT || 3000;

// express json middleware
app.use(requestLogger)
app.use(addTimeStamp)

app.use(express.json());
app.use(configureCors());


app.use(globalErrorhandler);

app.listen(PORT , ()=>{
    console.log(`Server is now running on port ${PORT}`);
})