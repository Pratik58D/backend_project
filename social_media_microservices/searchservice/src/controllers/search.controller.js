import Search from "../models/search.model.js";
import logger from "../utils/logger.js"

const searchPostController = async (req, res) => {
    logger.info("Search endpoint hit!");
    try {
        const {query} = req.query;

        const results = await Search.find(
            {
                $text : {$search : query},
            },
            {
                score :{$meta : "textScore"}
            }
        )
        .sort({score: {$meta: "textScore"}})
        .limit(10)

        return res.json(results)

    } catch (error) {
        logger.error("Error while searching post", error);
        return res.status(500).json({
            success: false,
            message: "Error while searching post",
        });

    }
}

export default searchPostController;