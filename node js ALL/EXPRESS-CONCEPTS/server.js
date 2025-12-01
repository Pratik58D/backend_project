//-> major releases -> Api -> v1 , v2

import express from 'express';
import dotenv from 'dotenv';
import configureCors from './src/config/corsConfig.js';
import {addTimeStamp, requestLogger} from './src/middleware/customMiddleware.js';
import { globalErrorhandler } from './src/middleware/errorHandler.js';
import { urlVersioning } from './src/middleware/apiversioning.js';
import { createBasicRateLimiter } from './src/middleware/rateLimiting.js';
import testRoutes from "./src/route+controller/test.js"
dotenv.config();

const app = express();

const PORT  =  process.env.PORT || 3000;

// express json middleware
app.use(requestLogger)
app.use(addTimeStamp)


app.use(express.json());
app.use(configureCors());

app.use(createBasicRateLimiter(100,15*60*1000))  // 100 req per 15minutes



// version control + ratelimiter 
app.use(urlVersioning("v1")) 

app.use("/api/v1", createBasicRateLimiter(2,1*60*1000),testRoutes);
app.use("/api/v2", createBasicRateLimiter(2,1*60*1000),testRoutes);

app.use(globalErrorhandler);



app.listen(PORT , ()=>{
    console.log(`Server is now running on port ${PORT}`);
})