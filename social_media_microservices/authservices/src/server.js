import express from "express"
import dotenv from "dotenv";
import helmet from 'helmet';
import cors from "cors";
import connectDb from "./config/dbconnection.js";
import logger from "./utils/logger.js";
import {RateLimiterRedis} from "rate-limiter-flexible"
import Redis from "ioredis"
import {rateLimit} from "express-rate-limit"
import RedisStore from "rate-limit-redis"
import authRoutes from "./routes/auth.route.js"
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

connectDb();

const redisClient = new Redis(process.env.REDIS_URL);


//middleware 
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req,res,next)=>{
    logger.info(`Received ${req.method} request to ${req.url}`)
    logger.info(`Request body , ${req.body}`)
    next()
})

//DDos protection and rate limiting 
//RateLimiterRedis rate-limits ALL incoming requests to your Express app.
//Client → Express → RateLimiter → Redis → Allow / Block

const rateLimiter = new RateLimiterRedis({
    storeClient : redisClient,   //Use Redis to store request counts.
    keyPrefix : "middleware",    //Avoid key collisions
    points : 10,   //A client can make 10 requests
    duration : 4    //Per 1 second
})


app.use(async(req,res,next)=>{
    try {
        await rateLimiter.consume(req.ip);
        next();
    } catch (error) {
        logger.warn(`Rate limit exceeded for ip: ${req.ip}`);
        return res.status(429).json({
            message : "Too may requests. please try again later."
        })
        
    }

})


//ip based rate limiting for sensitive endpoints

const sensitiveEnpointsLimiter = rateLimit({
    windowMs : 15 * 60 * 1000,
    max: 50,
    standardHeaders: true,
    legacyHeaders : false,
    handler: (req,res)=>{
        logger.warn(`sensitive endpoint rate limit exceeded for ip : ${req.ip}`)
         return res.status(429).json({
            message : "Too may requests. please try again later."
        })
    },
    store: new RedisStore({
        sendCommand : (...args) => redisClient.call(...args),
    })
})

//apply this sensitiveEndpointsLimiter to our routes
app.use('/api/auth/register', sensitiveEnpointsLimiter)


app.use("/api/auth", authRoutes)

//error handler
app.use(errorHandler)

app.listen(port, ()=>{
    logger.info(`Auth server is running on port ${port}`)
})



//unhandled promise rejection handler

process.on('unhandledRejection',(reason , promise)=>{
    logger.error(`unhandled rejection at ${promise} reseon ${reason}`)
})