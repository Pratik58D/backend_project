import express from "express";
import mongoose from "mongoose";
import { getOriginalUrl, shortUrl } from "./controllers/url.controller.js";


const app = express();
app.use(express.urlencoded({extended : true}))
const port = 5000;

mongoose.connect(
    "mongodb://localhost:27017/",{
        dbName : "url_shortner"
    }
).then(()=> console.log("mongoodb connected"))
.catch((err)=> console.error(err))


//rendering ejs file

app.get("/",(req,res)=>{
    res.render("index.ejs",{shortUrl :null})
})

//logic of shorting
app.post("/shortner",shortUrl)

//redirect to original url using short code :- dyanmic routing
app.get("/:shortCode",getOriginalUrl)

app.listen(port ,()=>{
    console.log(`server is running on port ${port}......`)
})