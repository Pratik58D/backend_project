import winston from "winston";

const logger = winston.createLogger({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.splat(),   //This allows using placeholders
        winston.format.json()
    ),
   
    //This adds default metadata to every log line
    defaultMeta: { service: "post-service" },
    
    // Transports define destinations for logs.
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),    //gives colorful log levels during development.
                winston.format.simple()      //prints human-readable text instead of JSON.
            )
        }),
        new winston.transports.File({ filename: "error.log", level: "error" }),
        new winston.transports.File({ filename: "combined.log" })
    ]
})


export default logger;