import Post from "../models/post.model.js";
import logger from "../utils/logger.js"
import validateCreatePost from "../utils/validation.js";


const createPost = async (req, res) => {
    logger.info("Create post endpoint reached");
    try {
        //validation the schema
        const { error } = validateCreatePost(req.body);
        if (error) {
            logger.warn("Validation error", error.details[0].message);
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });
        }
        const { content, mediaIds } = req.body;
        const newPost = new Post({
            user: req.user.userId,
            content,
            mediaIds: mediaIds || []
        })

        await newPost.save();

        await publishEvent("post.created", {

        })
        logger.info("Post created successfully", newPost);
        return res.status(200).json({
            success: true,
            message: "Post created successfully",
        });

    } catch (error) {
        logger.error("Error in creating post Controller", error);
        res.status(500).json({
            success: false,
            message: "Error creating post",
        });

    }
}


const getAllPosts = async (req, res) => {
    logger.info("Fetch all post endpoint reached");
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;




    } catch (error) {
        logger.error("Error fetching all post Controller", error);
        res.status(500).json({
            success: false,
            message: "Error creating post",
        });

    }
}

const getPost = async (req, res) => {
    logger.info("single post fetch endpoint reached");
    try {
        const postId = req.params.int;



    } catch (error) {
        logger.error("Error fetching single post Controller", error);
        res.status(500).json({
            success: false,
            message: "Error creating post",
        });

    }
}


const deletePost = async (req, res) => {
    logger.info("Delete post endpoint reached");
    try {
        const postId = req.params.int;



    } catch (error) {
        logger.error("Error deleting post Controller", error);
        res.status(500).json({
            success: false,
            message: "Error creating post",
        });

    }
}




export { createPost, getAllPosts, getPost, deletePost }