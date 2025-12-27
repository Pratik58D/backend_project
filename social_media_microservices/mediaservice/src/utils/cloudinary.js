import cloudinary from "cloudinary"
import logger from "./logger";

cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.API_KEY,
    api_secret : process.env.API_SECRET
})

const uploadMediaToCloudinary = (file) =>{
    return new Promise((resolve , reject)=>{
        const uploadStrem = cloudinary.uploader.upload_stream(
            {
                resource_type : "auto"
            },
            (error , result) => {
                if(error){
                    logger.error("Error while uploading media to cloudinary", error);
                    reject(error)
                }else{
                    resolve(result)
                }
            }
        );
        uploadStrem.end(file.buffer);
    })
}

const deleteMediaFromCloudinary = async(publicId) =>{
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        logger.info("Media deleted sucessfully from cloudinary" , publicId);
        return result;    
    } catch (error) {
        logger.error("Error deleting media from Cloudinary", error);
        throw error;  
    }
}


export {uploadMediaToCloudinary , deleteMediaFromCloudinary}