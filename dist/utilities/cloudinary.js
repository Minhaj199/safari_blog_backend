import cloudinary from "cloudinary";
import dotEnv from "dotenv";
dotEnv.config();
import fs from "fs";
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
});
export async function cloudinaryUpload(path) {
    try {
        const result = await cloudinary.v2.uploader.upload(path, {
            folder: "safari feed",
        });
        fs.unlink(path, () => { });
        if (result.secure_url) {
            return result.secure_url;
        }
        else {
            throw new Error("error on image uploading");
        }
    }
    catch (error) {
        throw new Error(error.message || "error on cloudinary");
    }
}
