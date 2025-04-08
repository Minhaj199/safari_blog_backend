import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utilities/jwt.js";

declare global {
  namespace Express {
    interface Request {
      userID?: string;
      userName: string;
    }
  }
}

export const userAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers["authorization"];
    const parsedToken = verifyToken(token);
    req.userID = parsedToken.id;
    req.userName = parsedToken.name;
    next();
  } catch (error) {
    next(error);
  }
};
