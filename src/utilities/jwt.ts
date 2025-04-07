import jwt from "jsonwebtoken";
import { customError } from "./customeError.js";


export function createToken(id:string,name:string) {
  try {
    const token: string = jwt.sign(
      { id,name},
      process.env.JEW_KEY as string,
      { expiresIn: "1h" }
    );
    return token;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

export function verifyToken(token: unknown) {
  if (typeof token !== "string") {
    throw new Error("token not found");
  }
  try {
    const decode = jwt.verify(token, process.env.JEW_KEY as string);
    return decode as { id: string; name: string };
  } catch (error) {
    if (error instanceof Error) {
      if(error.message==='jwt expired'){
        throw customError(error.message,401)
      }
      throw new Error('something');
    }
    throw new Error("internal server error");
  }
}
