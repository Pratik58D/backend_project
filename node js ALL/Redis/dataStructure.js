import { createClient } from "redis";

const client = createClient({
    host : "localhost",
    port: 6379,    
})


// event listener for error message emited by redis server

client.on("error",(error)=> console.log("redis client error",error));

async function redisDataStruncture(){
    try {
        // string -> SET , GET , MSET , MGET

        await client.set("user:name" , "virat kohli")
        const name = await client.get("user:name")
        
    } catch (error) {
        console.error(error)
    }finally{
        client.quit();
    }
}