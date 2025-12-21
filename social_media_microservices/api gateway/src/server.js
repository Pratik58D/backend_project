import express from "express";
import dotenv from 'dotenv';
import helmet from "helmet";
import Redis from "ioredis"
import cors from "cors"
import rateLimit from "express-rate-limit";
import {RedisStore} from "rate-limit-redis";
import errorHandler from "./middleware/errorhandler.js";
import proxy from "express-http-proxy"
import logger from "./utils/logger.js";
import validatetoken from "./middleware/authMiddleware.js";

dotenv.config();
const app = express()
const port = process.env.PORT
const redisClient = new Redis(process.env.REDIS_URL)


// Add this debugging
console.log('=== ENVIRONMENT VARIABLES ===');
console.log('PORT:', process.env.PORT);
console.log('IDENTITY_SERVICE_URL:', process.env.IDENTITY_SERVICE_URL);
console.log('POST_SERVICE_URL:', process.env.POST_SERVICE_URL);
console.log('REDIS_URL:', process.env.REDIS_URL);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Loaded' : 'NOT LOADED');
console.log('============================');


app.use(helmet());
app.use(cors());
app.use(express.json())



//rate limiting
const ratelimitOptions = rateLimit({
    windowMs : 15*60*1000,     //time window
    max : 100,                 //Each IP can make 100 requests per 15 minutes
    standardHeaders: true,     //dds RFC-standard rate-limit headers to the response.
    legacyHeaders : false,     //This disables old headers
    //This runs when the limit is exceeded.
    handler : (req , res)=>{
        logger.warn(`sensitive endpoints rate limit exceeded for IP : ${req.ip}`);
        res.status(429).json({sucess : false , message : "Too many requests"})
    },
    //Instead of storing request counts in memory Counts are stored in Redis
    store: new  RedisStore({
        sendCommand: (...args) => redisClient.call(...args)
    })
})


app.use(ratelimitOptions);

//logging middleware 
app.use((req,res, next)=> {
    logger.info(`Received ${req.method} request to ${req.url}`);
    logger.info("Request body" ,req.body);
    next();
})


const proxyOptions = {
    proxyReqPathResolver : (req) =>{
        return req.originalUrl.replace(/^\/v1/, "/api");
    },
    proxyErrorHandler : (err, res, next)=>{
        logger.error(`Proxy error: ${err.message}`);
        res.status(500).json({
            message : `Internal server error`,
            error : err.message,
        });
    },
};


//setting up proxy for our auth service
app.use(
    "/v1/auth",
    proxy(process.env.IDENTITY_SERVICE_URL , {
        ...proxyOptions,
        proxyReqOptDecorator: (proxyReqOpts , srcReq)=>{
            proxyReqOpts.headers["Content-Type"] = "application/json";
            return proxyReqOpts;
        },
        userResDecorator : (proxyRes , proxyResData , userReq , userRes)=>{
            logger.info(
                `Response recieved from post service : ${proxyRes.statusCode}`
            );

            return proxyResData;
        }
    })
)

//setting up proxy for our post service
app.use(
    "/v1/posts",
    validatetoken, 
    proxy(process.env.POST_SERVICE_URL,{
        ...proxyOptions,
        proxyReqOptDecorator:(proxyReqOpts,srcReq)=>{
            proxyReqOpts.headers["Content-Type"] = "application/json";
            proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;
            proxyReqOpts.headers["authorization"] = srcReq.headers.authorization;


            return proxyReqOpts;
        },
        userResDecorator:(proxyRes, proxyResData , userReq , userRes)=>{
            logger.info(
                `Response received from Post service: ${proxyRes.statusCode}`
            );
            return proxyResData
        }

    })

)

app.use(errorHandler);



app.listen(port,()=>{
    logger.info(`API Gateway is running on port ${port}`);
    logger.info(`auth service is running on port ${process.env.IDENTITY_SERVICE_URL}`)
    logger.info(`Redis Url ${process.env.REDIS_URL}`)
    logger.info(`posts service is running in port ${process.env.POST_SERVICE_URL}`)
})

