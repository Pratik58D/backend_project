import amqp from "amqplib"
import logger from "./logger.js"


let connection = null;
let channel = null;

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



export {connectionToRabbitMQ  ,  }