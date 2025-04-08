export function customError(message = "user not found", statusCode = 400) {
    const err = new Error(message);
    err.code = statusCode;
    return err;
}
