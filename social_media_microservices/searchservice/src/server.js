import dotenv from "dotenv"
import express from "express";
import helmet from "helmet";
import cors from "cors";
import Redis from "ioredis";
import connectDb from "./config/dbconnection.js";
import errorHandler from "./middleware/error.middleware.js";
import logger from "./utils/logger.js";
import { connectionToRabbitMQ } from "./utils/rabbitmq.js";
import searchRoutes from "./routes/search.route.js"

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3004;

//connect to mongoDb
connectDb();


const redisClient = new Redis(process.env.REDIS_URL);

//middleware 

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req,res,next)=>{
    logger.info(`Recieved ${req.method} request to ${req.url}`);
    logger.info("request body" , req.body)
    next();
});

// implement Ip based rate limiting for sensitive endpoints

app.use("/api/search", searchRoutes)

app.use(errorHandler)



async function startServer(){
    try {
        await connectionToRabbitMQ();

        //consume the events / subscribe to the events
        await consume
        
    } catch (error) {
        logger.error(error , "Failed to start search service")
        process.exit(1)
    }
}

startServer();