import bcrypt from "bcrypt";
export const passwordHashing = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("internal server error");
    }
};
export const passwordComparing = (password, encrypedPassword) => {
    try {
        if (typeof password !== "string") {
            throw new Error("password not valid type");
        }
        return bcrypt.compare(password, encrypedPassword);
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("internal server error");
    }
};
