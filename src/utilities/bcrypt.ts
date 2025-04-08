import bcrypt from "bcrypt";

export const passwordHashing = async (password: string) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("internal server error");
  }
};
export const passwordComparing = (
  password: string,
  encrypedPassword: string
) => {
  try {
    if (typeof password !== "string") {
      throw new Error("password not valid type");
    }
    return bcrypt.compare(password, encrypedPassword);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("internal server error");
  }
};
