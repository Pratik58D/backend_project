import rateLimit from "express-rate-limit";


const createBasicRateLimiter = (maxRequest , time) =>{
    return rateLimit({
        max : maxRequest,
        windowMs : time,
        message : "Too many request",
        standardHeaders : true,
        legacyHeaders : false
    })
}


export {createBasicRateLimiter};