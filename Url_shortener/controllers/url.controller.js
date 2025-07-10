import shortid from "shortid";
import { Url } from "../models/url.model.js";

export const shortUrl = async(req,res) =>{

    const {longUrl} = req.body;
    const shortCode = shortid.generate();

    const shortUrl = `http://localhost:5000/${shortCode}`

    //save to database
    const newUrl = new Url({
        shortCode,
        longUrl
    })
    await newUrl.save();
    console.log("short saved =", newUrl)
    res.render("index.ejs",{shortUrl});

}


export const getOriginalUrl = async(req,res)=>{
    const {shortCode} = req.params;
    //find in database
    const originalUrl = await Url.findOne({shortCode})
    if(originalUrl){
        res.redirect(originalUrl.longUrl);
    }else{
        res.json({message : "invalid shortcode"})
    }
}