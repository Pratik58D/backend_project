import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import connectDb from "./config/dbconnection.js";
import errorHandler from "./utils/error.middleware.js";
import logger from "./utils/logger.js";
import mediaRoutes from "./routes/media.routes.js"
import { connectionToRabbitMQ, consumeEvent } from "./utils/rabbitmq.js";
import handlePostDeleted from "./eventHandlers/eventHandlers.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3003;

// connect to mongoDb
connectDb();

app.use(cors());
app.use(helmet());
app.use(express.json());


app.use((req, res, next) => {
    logger.info(`Received ${req.method} request to ${req.url}`);
    next()
});

//Todo - implement Ip based rate limiting for sensitive endpoints


app.use("/api/media", mediaRoutes)

app.use(errorHandler)

async function startServer() {
    try {
        await connectionToRabbitMQ();
        //consume all the events
       await consumeEvent("post.deleted" , handlePostDeleted)

        app.listen(port, () => {
            logger.info(`Media_Service is runnig in port  ${port} `)
        })

    } catch (error) {
        logger.error("Failed to connect to server" , error);
        process.exit(1);
    }
}


startServer();

// unhandled promise rejection
process.on("unhandledRejection", (reason, promise) => {
    logger.error("unhandled Rejection at", promise, "reason: ", reason)
})