import { createClient } from "redis";

const client = createClient({
    host: "localhost",
    port: 6379,
})


// event listener for error message emited by redis server

client.on("error", (error) => console.log("redis client error", error));

async function redisDataStruncture() {
    try {

        await client.connect();
        console.log("connected to redis");



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


        //.........3.sets => SADD, SMEMBERS,SISMEMBER , SREM.......
        //   sets are -- object in JavaScript has collection of unique values.
        //Unordered: The order in which elements are returned is not guaranteed and is often based on internal hash table implementation, not the order you inserted them.

        //   const numbers = [1,2,3,4,5,1,2,3,4];
        //   const newSet = new Set(numbers);
        //   console.log({newSet})      // { newSet: Set(5) { 1, 2, 3, 4, 5 } }


        //    await client.sAdd("user:nickName",["pratik", "hari","krishna","hari"]);       
        //    const extractUsersName = await client.sMembers("user:nickName")
        //    console.log({extractUsersName})   //[ 'hari', 'krishna', 'pratik' ]

        //    const isHariuserName= await client.sIsMember("user:nickName","hari") ;
        //    console.log({isHariuserName})

        //   await client.sRem("user:nickName","Hari")

        //    const getUpdatedUser = await client.sMembers("user:nickName")
        //    console.log({getUpdatedUser})


        //..............4.sorted sets.................
        //leaderboards, rate limiters, and prioritized queues where elements need to be ordered based on a specific numerical value
        //only understand score and value
        //zAdd , ZRANGE , ZRANK ,ZREM

      
        

        //.....................5.hashed ..............
        //an object (like a JavaScript object ) that stores a collection of field-value pairs under a single key.
        //Think of it as a table where:  
        // The Hash Key: Is the name of the entire map (e.g., user:100).
        // Fields: Are the specific attributes/columns (e.g., name, email, age).
        // Values: Are the data associated with those attributes (e.g., "Alice", "alice@example.com", "30").
        //HSET , HGET , HGETALL , HDEL

        await client.hSet("product",{
            name: "p1",
            description : "product one description",
            rating : "5"
        })

        const getProductRating = await client.hGet("product","rating")
        console.log(getProductRating)

        const getallProductdetail = await client.hGetAll("product")
        console.log({getallProductdetail});

        await  client.hDel("product","rating")
        
        const updatedProductdetail = await client.hGetAll("product")
        console.log({updatedProductdetail});











    } catch (error) {
        console.error("redis datastructure error", error)
    } finally {
        await client.quit();
    }
}


redisDataStruncture();