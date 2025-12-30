import Post from "../models/post.model.js";
import logger from "../utils/logger.js"
import validateCreatePost from "../utils/validation.js";

async function invalidatePostCache(req, input) {
    const cachedKey = `post:${input}`;
    await req.redisClient.del(cachedKey);

    const keys = await req.redisClient.keys("posts:*");

    if (keys.length > 0) {
        await req.redisClient.del(keys)
    }
}

//create post controller
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

        // await publishEvent("post.created", {

        // })

        await invalidatePostCache(req, newPost._id.toString());

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

// all post fetch controller
const getAllPosts = async (req, res) => {
    logger.info("Fetch all post endpoint reached");
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;

        const cacheKey = `posts:${page}:${limit}`;
        const cachedPosts = await req.redisClient.get(cacheKey);

        if (cachedPosts) {
            return res.json(JSON.parse(cachedPosts))
        }

        const posts = await Post.find({})
            .sort({ created: -1 })
            .skip(startIndex)
            .limit(limit)

        const totalPostCount = await Post.countDocuments();

        const result = {
            posts,
            currentpage: page,
            totalPages: Math.ceil(totalPostCount / limit),
            totalPosts: totalPostCount,
        }

        //saving the posts in redis cache --- SET + EXPIRE  --- Stores data in Redis---Sets an expiry time for that data
        //After 5 minutes, Redis automatically deletes this key.
        await req.redisClient.setex(cacheKey, 300, JSON.stringify(result));

        res.json(result);

    } catch (error) {
        logger.error("Error fetching all post Controller", error);
        res.status(500).json({
            success: false,
            message: "Error fetching all post",
        });

    }
}


// single post fetch controller
const getPost = async (req, res) => {
    logger.info("single post fetch endpoint reached");
    try {
        const postId = req.params.id;
        const cachedKey = `post:${postId}`;
        const cachedPost = await req.redisClient.get(cachedKey)

        if (cachedPost) {
            return res.json(JSON.parse(cachedPost))
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false
            })
        }

        await req.redisClient.setex(
            cachedPost,
            3600,
            JSON.stringify(post)
        )

        return res.json(post);

    } catch (error) {
        logger.error("Error fetching single post Controller", error);
        res.status(500).json({
            success: false,
            message: "Error in fetching single post",
        });

    }
}


const deletePost = async (req, res) => {
    logger.info("Delete post endpoint reached");
    try {
        console.log("req.params.id" , req.params.id);
        console.log(req.user.userId , "abcde");
        
        const post = await Post.findOneAndDelete({
            _id: req.params.id,
            user: req.user.userId
        })

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false,
            });
        }

        await invalidatePostCache(req, req.params.id);

        return res.status(200).json({
            message: 'Post deleted successfully',
        })
    } catch (error) {
        logger.error("Error deleting post Controller", error.message);
        res.status(500).json({
            success: false,
            message: "Error deleting post",
        });

    }
}




export { createPost, getAllPosts, getPost, deletePost }