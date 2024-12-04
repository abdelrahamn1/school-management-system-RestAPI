const AppError = require("../utils/AppErrorr.js");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}. Please use a valid ID.`;
  const error = new AppError(message, 400); // 400: Bad Request
  error.isOperational = true; // Mark as an operational error
  return error;
};

const handelDuplcatedVlaue = (err) => {
  const key = Object.keys(err.keyValue)[0];
  const value = err.keyValue[key];
  const message = `This ${key} : ${value} is already exist!`;
  return new AppError(message, 400);
};
const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);

const handleJWTExpiredError = () =>
  new AppError("Your token has expired! Please log in again.", 401);

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors)
      .map((el) => el.message)
      .join(", ");
    const message = `Invalid input data: ${errors}`;
    return new AppError(message, 400);
  };

  if (process.env.NODE_ENV === "production") {
    let error = Object.assign({}, err, { message: err.message });
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();
    if (error.code === 11000) error = handelDuplcatedVlaue(error);
    if (err.name === "ValidationError") {
      error = handleValidationErrorDB(err);
    }
    res.status(error.statusCode).json({
      status: error.status,
      message: error.isOperational ? error.message : "Something went Wrong!",
    });
  } else {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  }
};

module.exports = globalErrorHandler;
