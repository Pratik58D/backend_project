import { GoogleGenerativeAI}  from "@google/generative-ai";

import express from "express";
import env from "dotenv";

env.config();

const app = express();

app.use(express.json());


const gemini_api_key = process.env.API_KEY;
const googleAI = new GoogleGenerativeAI(gemini_api_key);
const geminiModel = googleAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});
// different models are : gemini-1.5-flash,gemini-1.5-pro

// let question = "what is node js";

const generate = async(question)=>{
    try {
        const prompt = question;
        const result = await geminiModel.generateContent(prompt);
        const response = result.response;
        console.log(response.text());
         return response.text();
        
    } catch (error) {
        console.log("response Error" , error);
        
    }
}


app.post("/genereate-text", async(req , res)=>{
    const {question} = req.body;
    if(!question){
                return res.status(400).json({ error: "Question is required." });
    }
    try {
        const generateText = await generate(question);
        console.log(generateText)
        res.json({text : generateText})
        
    } catch (error) {
         res.status(500).json({ error: error.message });
        
    }
    
})


app.listen(3000 , ()=>{
    console.log("serveer is running in port 3000..")
})