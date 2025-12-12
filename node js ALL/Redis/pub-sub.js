// publish/subscribe
// It’s a messaging pattern used for real-time communication between different parts of your app
// Think of it like YouTube:
//       A channel posts a video → publish  === Publisher----Sends a message to a channel.
//       Subscribers get notified → subscrib ---Subscriber---Listens on that channel and receives every message instantly.

//->publisher -> send -> channel -> subscriber will consume

import { createClient } from "redis";

const client = createClient({
    host: "localhost",
    port: 6379,
})

client.on("error", (error) => console.log("redis client error", error));


{
    async function PUBSUB() {
        try {
            await client.connect();
            console.log("connected to redis");

            //1. Create a subscriber
            //2. Connect and subscribe
            //3. Publish messages


            const subscriber = client.duplicate() //create a new client and shares same connection ;
            await subscriber.connect();

            await subscriber.subscribe("order-channel", (message, channel) => {
                console.log(`recieved: ${message} from  ${channel}`);
            })

            //publish message to the order-channel
            await client.publish("order-channel", "new order placed")
            await client.publish("order-channel", "new order2 placed")


            await new Promise((resolve) => setTimeout(resolve, 1000))

            await subscriber.unsubscribe("order-chanenl");
            await subscriber.quit();




        } catch (error) {
            console.error("redis pubsub error", error)
        } finally {
            await client.quit();
        }
    }

    // PUBSUB();
}




{

    async function pipeliningTransaction() {
        try {
            await client.connect();
            console.log("connected to redis");

            //...................pipelining and transcation..................................

            //1. Pipelining means sending multiple commands at once to Redis without waiting for each response.it is not atomic
            //2. transaction makes sure a group of commands runs as a single atomic unit.


            const multi = client.multi();

            multi.set("name-transaction", 'virat')
            multi.set("age-transaction", '35')

            multi.get("name-transaction")
            multi.get("age-transaction")

            const results = await multi.exec();
            console.log({ results })

            // start pipelien -- no atomicity

            const pipeline = client.multi();   //// multi() is used for both pipeline and transaction

            //add command to pipeline
            pipeline.set("name-pipeline", "sachin");
            pipeline.set("age-pipeline", "40");

            pipeline.get("name-pipeline");
            pipeline.get("age-pipeline");

            // execute pipeline
            const pipeResults = await pipeline.exec();
            console.log("pipeline results:", pipeResults);


            //example------batch data operation 

            console.log("performance test")
            console.time('without Pipelining')

            for(let i=0 ; i<1000 ; i++){
                await client.set(`user${i}`,`user_values${i}`)
            }

            console.timeEnd('without Pipelining')


            
            console.time("with pipelining")

            const pipelineExamle = client.multi()

            for (let i = 0 ; i<1000 ; i++){
                 pipelineExamle.set(`userPipeline_key${i}`,`userPipeline_values${i}`)
            }

            await pipelineExamle.exec();
            console.timeEnd('with pipelining')

        } catch (error) {
            console.error("redis pipeline and transcation error", error)
        } finally {
            await client.quit();
        }
    }

    pipeliningTransaction();

}