import express from "express";
import { createAuthor, createBook, getBookWithAuthor } from "../controller/bookController.js";

const router = express.Router();

router.post("/author", createAuthor);
router.post("/book", createBook);
router.get("/book/:id", getBookWithAuthor);

export default router;