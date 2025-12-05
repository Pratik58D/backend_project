import { createClient } from "redis";

const client = createClient({
    host : "localhost",
    port: 6379,    
})


// event listener for error message emited by redis server

client.on("error",(error)=> console.log("redis client error",error));

async function redisDataStruncture(){
    try {

         await client.connect();
        console.log("conected to redis");
        


        // string -> SET , GET , MSET , MGET

        await client.set("user:name" , "virat kohli")
        const name = await client.get("user:name")
        console.log({name})

        // multiple value set

        await client.MSET(["user:email" , "virat@gmail.com" , "user:age" , "70" , "user:country", "Nepal"])

        const [email , age , country] = await client.MGET(["user:email" ,"user:age","user:country"])
        console.log({email}, {age} , {country})


        
    } catch (error) {
        console.error("redis datastructure error",error)
    }finally{
       await client.quit();
    }
}


redisDataStruncture();