import dotenv from "dotenv"
import express from "express";
import helmet from "helmet";
import cors from "cors";
import Redis from "ioredis";
import postRoutes from "./routes/post.route.js"
import connectDb from "./config/dbconnection.js";
import errorHandler from "./middleware/error.middleware.js";
import logger from "./utils/logger.js";

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
  logger.info(`Request body, ${req.body}`);
  next();
});


//*** implement Ip based rate limiting for sensitive endpoints


//routes -- passing redisclient to routes
app.use("/api/posts",postRoutes);

app.use(errorHandler);


app.listen(port, () => {
      logger.info(`Post service running on port ${port}`);
      console.log("post service is running on port" ,port);
});


process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at", promise, "reason:", reason);
});