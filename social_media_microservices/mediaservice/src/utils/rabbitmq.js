import amqp from "amqplib"
import logger from "./logger.js"


let connection = null;
let channel = null;

//An exchange is a router.Receive messages and decide which queue(s) should get them.
//An exchange: 1. Never stores messages.  2.Never processes messages.. 3.Only routes them
const EXCHANGE_NAME = 'socialmedia_events'

//Connect your Node.js app to RabbitMQ , Create a channel , Create (assert) an exchange , Reuse the same connection and channel across the app  

async function connectionToRabbitMQ(){
    try {
        connection = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();

        await channel.assertExchange(EXCHANGE_NAME , "topic", {durable : false});    //durable : false exchange is removed if RabbitMQ restarts
        logger.info("Connection to rabbit mq"); 
        return channel;
        
    } catch (error) {
        logger.error("Error while connection to rabbit mq", error)
    }
}

//An event is just a message, It represents a fact, not a command.
async function publishEvent(routingKey , message) {
    if(!channel){
        await connectionToRabbitMQ();
    }

    //The exchange uses the routing key to decide where the message goes.
    channel.publish(
        EXCHANGE_NAME,
        routingKey,
        Buffer.from(JSON.stringify(message))
    )
    logger.info(`Event published: ${routingKey}`)
}


async function consumeEvent(routingKey , callback){
    if(!channel){
        await connectionToRabbitMQ();
    }

    // A queue is a temporary storage box inside RabbitMQ.Hold messages until a consumer is ready to process them.

    const q = await channel.assertQueue(
        "",
        {exclusive : true}
    );

    // Send messages with this routing key to my queue.
    await channel.bindQueue(
        q.queue,
         EXCHANGE_NAME,
          routingKey
    );

    //RabbitMQ pushes messages one by one from the queue to your consumer.
    channel.consume(q.queue , (msg)=>{
        if(msg !== null){
            const content = JSON.parse(msg.content.toString());
            callback(content);
            channel.ack(msg)
        }
    })

    logger.info(`Subscibed to event : ${routingKey}`);
}

export {connectionToRabbitMQ  ,publishEvent  ,consumeEvent }