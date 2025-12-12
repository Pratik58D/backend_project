import Redis from "ioredis";
//redis client library for nodejs //more feature over redis


const redis = new Redis();


async function ioRedis(){
    try {
        await redis.set("name", "sita")
        const val = await redis.get("name")
        console.log({val})
        
    } catch (error) {
        console.error({error})      
    }
    finally{
        redis.quit();
    }
}


ioRedis();