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
        


        //1.......... string -> SET , GET , MSET , MGET..............

        // await client.set("user:name" , "virat kohli")
        // const name = await client.get("user:name")
        // console.log({name})

        // multiple value set

        // await client.MSET(["user:email" , "virat@gmail.com" , "user:age" , "70" , "user:country", "Nepal"])

        // const [email , age , country] = await client.MGET(["user:email" ,"user:age","user:country"])
        // console.log({email}, {age} , {country})


        // 2...........lists -> Lpush ,Rpush , Lrange , lpop , rpop...................

        // client.lPush: This command is used to insert one or more values at the head (left side) of the List stored at the key "notes"
        // jati choti code chalxa push element memory ma store hudai janxa

        // await client.lPush("notes",["ram","sham","hari"]);
        // const extractNotes = await client.lRange("notes",0 ,1)
        // const extractNotes = await client.lRange("notes",0 ,-1)
        // console.log(extractNotes)

     //Removes and returns the element at the Head (Left) of the list.
      //List: [A, B, C] Returns 'A', List becomes [B, C]
       
    //    const firstNote = await client.lPop("notes");
    //     console.log({firstNote})             //hari

    //     const remainNotes = await client.lRange("notes",0,-1);
    //     console.log({remainNotes})

       
       //3.........sets => SADD, SMEMBERS,SISMEMBER , SREM.......

        
    } catch (error) {
        console.error("redis datastructure error",error)
    }finally{
       await client.quit();
    }
}


redisDataStruncture();