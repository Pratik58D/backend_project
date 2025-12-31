import express from "express";
import authenticateRequest from "../middleware/auth.middleware";
import searchPostController from "../controllers/search.controller";


const router = express.Router();

router.use(authenticateRequest);


router.get("/posts" , searchPostController);


export default router;