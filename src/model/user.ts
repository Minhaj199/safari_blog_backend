import mongoose, { Schema } from "mongoose";
import { User } from "src/types/interfaces.js";
import { passwordHashing } from "../utilities/bcrypt.js";

const schema = new Schema<User>({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  phone: { type: String, unique: true },
  dob: Date,
  password: String,
  articlePreferences: [String],
});

schema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const hashedPassword = await passwordHashing(this.password);
    this.password = hashedPassword;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
});
export const userModel = mongoose.model<User>("users", schema);
