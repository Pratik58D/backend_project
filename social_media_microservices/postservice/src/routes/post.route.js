import express from "express";
import { createPost, deletePost, getAllPosts, getPost } from "../controllers/post.controllers.js";
import authenticateRequest from "../middleware/auth.middleware.js";

const router = express.Router();

//middleware => for authentication of user
router.use(authenticateRequest);

router.post("/create-post",createPost);
router.get("/all-posts",getAllPosts);
router.get("/:id", getPost);
router.delete("/:id",deletePost);



export default router;