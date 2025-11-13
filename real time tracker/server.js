import express from "express";
import http from "http";
import {Server} from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const server = http.createServer(app);
const io = new Server(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine" , "ejs");
app.use(express.static(path.join(__dirname,"public")));

io.on("connection",(socket)=>{
    console.log("connected")
    socket.on("send-location" , (data)=>{
        io.emit("recieve-location",{id:socket.id , ...data})
    });

    socket.on("disconnect",function(){
        io.emit("user-disconnected", socket.id)

    })
})

app.get("/", (req,res)=>{
    res.render("index")
})

server.listen(5000 , "0.0.0.0", ()=>{
    console.log("server is running...")
})