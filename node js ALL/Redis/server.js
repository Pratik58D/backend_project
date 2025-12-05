import { createClient } from "redis";

const client = createClient({
    host : "localhost",
    port: 6379,    
})


// event listener for error message emited by redis server

client.on("error",(error)=> console.log("redis client error",error));


async function testRedisConn(){
    try {
        await client.connect();
        console.log("conected to redis");
        
        //set has key value pair

        await client.set("key","pratik")

        const extractValue = await client.get("key");   
        console.log(extractValue)  
        
        const deleteCount = await client.del("key");
        console.log(deleteCount)

        const extractUpdatedValue = await client.get("key");
        console.log({extractUpdatedValue})


        await client.set("count",'100');
        const incrementCount = await client.incr("count");
        console.log({incrementCount})

        const decrementcount = await client.decr("count");
        console.log(decrementcount);

        await client.decr("count");
        await client.decr("count");
        await client.decr("count");
        await client.decr("count");
        await client.decr("count");

        console.log(await client.get("count"));


    } catch (error) {
        console.error(error)
    }finally{
        await client.quit();
    }
}



testRedisConn();