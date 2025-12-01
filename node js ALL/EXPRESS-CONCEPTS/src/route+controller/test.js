import express from 'express'
import { asyncHandler } from '../middleware/errorHandler.js';


const router = express.Router();
const user = {
    user: "pratik devkota",
    password: "chitaah"
}

router.get("/user", asyncHandler(async (req, res) => {
    res.send(user)
})
)


export default router;