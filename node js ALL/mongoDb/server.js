import express from "express"
import mongoose from "mongoose";
import env from "dotenv";
import productRoutes from "./routes/product.route.js"
import bookRoutes from "./routes/book.routes.js"

const app = express();
env.config();
const port = process.env.PORT || 6000;
// connect to database

const connDb = async()=>{
    try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log('mongoDb connected to : ' , conn.connection.host);
    } catch (error) {
        console.log("mongodb not connected" , error)
        
    }
}

// middleware
app.use(express.json());



app.get('/',(req,res)=>{
    res.send("hi this site is running");
})

app.use("/api/product" , productRoutes)
app.use("/api/book" ,bookRoutes )


app.listen(port , ()=>{
    console.log(`app is running on ${port}  `);
    connDb();
})