import mongoose from "mongoose";
export const connectionDB = async () => {
    try {
        const dbString = process.env.DB;
        if (!dbString) {
            throw new Error("error on db");
        }
        const connection = await mongoose.connect(dbString);
        if (connection) {
            console.log("db connected");
        }
    }
    catch (error) {
        process.exit(1);
    }
};
