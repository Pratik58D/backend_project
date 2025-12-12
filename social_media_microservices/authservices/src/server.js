import express from "express"
import mongoose from  "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const connectDb = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL);
        console.log("database connected", conn.connection.host)

        
    } catch (error) {
        console.log(error);
    }
}

connectDb();