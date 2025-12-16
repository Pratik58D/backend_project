import logger from "../utils/logger.js";
import mongoose from  "mongoose";


const connectDb = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL);
        logger.info(`database connected ${conn.connection.host}`)
        
    } catch (error) {
        logger.error(`mogodb connection error ${error}` );
    }
}


export default connectDb;
