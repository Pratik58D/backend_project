import mongoose from "mongoose";

const authorSchema = new mongoose.Schema({
    name : String,
    bio : String,
  
})

const Author = mongoose.model('Author' , authorSchema);

export default Author;