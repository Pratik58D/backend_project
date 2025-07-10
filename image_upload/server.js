import express from "express";
import mongoose from "mongoose";
import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";


const app = express();
const port = 3000;
dotenv.config();



mongoose.connect("mongodb://localhost:27017/image_upload")
.then(()=> console.log("MongoDb connected...."))
.catch((err)=> console.log(err))

cloudinary.config(
    {
        cloud_name : process.env.cloud_name,
        api_key : process.env.api_key,
        api_secret : process.env.api_secret_key
    }
)


// rendering ejs file
app.get("/",(req,res)=>{
    res.render('index.ejs', {url : null})
})



//file storage

const storage  = multer.diskStorage({
    //destination : "./public/uploads",
    filename : function(req,file,cb){
        const uniqueSuffix = Date.now() + path.extname(file.originalname);
        cb(null,file.fieldname + "-" + uniqueSuffix);
    }

});

const upload = multer({storage : storage});

// model for this
const imageSchema = new mongoose.Schema({
  filename: String,
  public_id: String,
  imgUrl: String,
});



const File = mongoose.model("cloudinary", imageSchema);



app.post("/upload",upload.single("file"), async(req,res)=>{
    const file = req.file.path;
    const cloudinaryRes = await cloudinary.uploader.upload(file,{
        folder :"pratice_image_upload"
    })


//save to database
const db = await File.create({
    filename : file.originalname,
     public_id: cloudinaryRes.public_id,
    imgUrl: cloudinaryRes.secure_url,

})

res.render("index.ejs" , {url: cloudinaryRes.secure_url});

})


app.listen(port, () => console.log(`sever is running on ${port}... `));
