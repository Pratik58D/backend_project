import logger from "../utils/logger.js";

const authenticateRequest = (req,res,next)=>{
    const userId = req.header["x-user-id"];
    console.log({userId})

    if(!userId){
        logger.warn(`Access attempted without user Id`);
        return res.status(401).json({
            success:false,
            message : "Authentication required! please login to continue"
        })
    }
    req.user = { userId };
    next();
}


export default authenticateRequest;