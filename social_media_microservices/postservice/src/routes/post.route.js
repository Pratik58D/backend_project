import express from "express";
import { createPost, deletePost, getAllPosts, getPost } from "../controllers/post-controllers.js";
import authenticateRequest from "../middleware/auth.middleware.js";

const router = express.Router();

//middleware => for authentication of user
router.use(authenticateRequest);

router.post("/create-post",createPost);
router.get("/all-post",getAllPosts);
router.get("/:id", getPost);
router.get("/:id",deletePost);



export default router;