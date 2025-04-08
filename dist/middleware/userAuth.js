import { verifyToken } from "../utilities/jwt.js";
export const userAuth = (req, res, next) => {
    try {
        const token = req.headers["authorization"];
        const parsedToken = verifyToken(token);
        req.userID = parsedToken.id;
        req.userName = parsedToken.name;
        next();
    }
    catch (error) {
        next(error);
    }
};
