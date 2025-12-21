import logger from "../utils/logger.js";
import jwt from "jsonwebtoken";


const validatetoken = (req, res, next) => {
    let authHeader = req.headers['authorization'];

    // Replace non-breaking spaces (char code 160) with regular spaces
    if (authHeader) {
        authHeader = authHeader.replace(/\u00A0/g, ' ').trim();
    }
    
    // Debug logging
    // console.log('=== DEBUG INFO ===');
    // console.log('authHeader:', authHeader);
    // console.log('authHeader type:', typeof authHeader);
    // console.log('authHeader length:', authHeader?.length);
    // console.log('First 10 chars:', authHeader?.substring(0, 10));
    // console.log('Char codes:', authHeader?.substring(0, 10).split('').map(c => c.charCodeAt(0)));
    // console.log('startsWith result:', authHeader?.startsWith("Bearer "));
    // console.log('startsWith "Bearer" (no space):', authHeader?.startsWith("Bearer"));
    // console.log('==================');

    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        logger.warn("Invalid authorization header format");
        return res.status(401).json({
            message: "Invalid authorization header",
            success: false,
        });
    }
    const token = authHeader && authHeader.split(" ")[1];
    console.log({ token });

    if (!token) {
        logger.warn("Access attempt without valid token!");
        return res.status(401).json({
            message: "Authentication required",
            success: false,
        });
    }
    console.log("jwt secret" ,process.env.JWT_SECRET)
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            logger.warn("Invalid token!");
            return res.status(401).json({
                message: "Invalid token!",
                success: false,
            });
        }
        req.user = user;
        next();
    })
}


export default validatetoken

