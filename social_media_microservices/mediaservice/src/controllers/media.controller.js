import { uploadMediaToCloudinary } from "../utils/cloudinary.js";
import logger from "../utils/logger.js"
import Media from "../models/media.model.js"


const uploadMedia = async (req, res) => {
    logger.info("Starting media upload........");
    try {
        // console.log("req.file" , req.file);
        
        if (!req.file) {
            logger.error("file not Found. Please add a file and try again");
            return res.status(400).json({
                success: false,
                message: "file not found. Please add a file and try again!",
            });
        }

        const { originalname, mimetype, buffer } = req.file;
        const userId = req.user.userId;

        logger.info(`file deatils: name = ${originalname} , type = ${mimetype}`);
        logger.info("uploading to cloudinary starting....")

        const cloudinaryResult = await uploadMediaToCloudinary(req.file);
        logger.info(
            `Cloudinary upload successfully. Public Id: - ${cloudinaryResult.public_id}`
        );

        const newMedia = new Media({
            publicId: cloudinaryResult.public_id,
            originalName: originalname,
            mimeType: mimetype,
            url: cloudinaryResult.secure_url,
            userId,
        })

        await newMedia.save();

        return res.status(201).json({
            success: true,
            mediaId: newMedia._id,
            url: newMedia.url,
            message: "Media upload is successfully",
        });

    } catch (error) {
        logger.error("Error creating media ", error);
        res.status(500).json({
            success: false,
            message: "Error creating media ",
        });

    }
}



const getMedias = async (req, res) => {
    try {
        const result = await Media.find({ userId: req.user.userId });
        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Cann't find any media for this user"
            })
        }

        res.status(200).json({
            result
        })

    } catch (error) {
        logger.error("Error fetching medias", error);
        res.status(500).json({
            success: false,
            message: "Error fetching medias",
        });

    }
}



export {getMedias , uploadMedia}