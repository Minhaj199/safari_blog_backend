import jwt from "jsonwebtoken";
import { customError } from "./customeError.js";
export function createToken(id, name) {
    try {
        const token = jwt.sign({ id, name }, process.env.JEW_KEY, { expiresIn: "1h" });
        return token;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
    }
}
export function verifyToken(token) {
    if (typeof token !== "string") {
        throw new Error("token not found");
    }
    try {
        const decode = jwt.verify(token, process.env.JEW_KEY);
        return decode;
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === "jwt expired") {
                throw customError(error.message, 401);
            }
            throw new Error("something");
        }
        throw new Error("internal server error");
    }
}
