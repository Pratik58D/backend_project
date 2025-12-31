import dotenv from "dotenv"
import express from "express";
import helmet from "helmet";
import cors from "cors";
import Redis from "ioredis";
import postRoutes from "./routes/post.route.js"
import connectDb from "./config/dbconnection.js";
import errorHandler from "./middleware/error.middleware.js";
import logger from "./utils/logger.js";
import { connectionToRabbitMQ } from "./utils/rabbitmq.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;
const redisClient = new Redis(process.env.REDIS_URL)
//database connection
connectDb();

//middleware
app.use(helmet())
app.use(cors())
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  logger.info('Request body',req.body);
  next();
});


//*** implement Ip based rate limiting for sensitive endpoints



//routes -- passing redisclient to routes
app.use("/api/posts",
  (req,res,next)=>{
    req.redisClient = redisClient
    next()
  },
  postRoutes
);

app.use(errorHandler);

async function startServer(){
  try {
    await connectionToRabbitMQ();
  
    app.listen(port, () => {
      logger.info(`Post service running on port ${port}`);
});
    
  } catch (error) {
    logger.error("Failed to connect to server", error);
    process.exit(1);
  }
}

startServer();

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at", promise, "reason:", reason);
});