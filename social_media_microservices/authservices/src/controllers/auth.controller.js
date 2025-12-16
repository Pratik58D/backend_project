import User from "../models/user.model.js";
import generateTokens from "../utils/generateTokens.js";
import logger from "../utils/logger.js"
import { validateUserRegistration } from "../utils/validation.js";


//user registration
const registerUser = async (req, res) => {
    logger.info("user registration endpoint..")
    try {
        //validate the Schema
        const { error } = validateUserRegistration(req.body);
        if (error) {
            logger.warn('validation error', error.details[0].message);
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            })
        }

        const { email, password, username } = req.body;
        let user = await User.findOne({
            $or: [{ email }, { username }]
        })
        if (user) {
            logger.warn("User already exists");
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        user = new User({ username, email, password });
        await user.save();
        logger.warn("User saved successfully", user._id);

        const { accessToken, refreshToken } = await generateTokens(user);
        res.status(201).json({
            success: true,
            message: "User registered successfully!",
            accessToken,
            refreshToken,
        });

    } catch (error) {
        logger.error("User Registration errror occured", error);
        res.status(500).json({
            sucess: false,
            message: "Internal server error"
        })
    }
}

//user login


//refresh token



//logout




export { registerUser };