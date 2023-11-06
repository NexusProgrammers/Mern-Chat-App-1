export const notFound = (req, res, next) => {
  res.status(404);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode || 500;
  let message = err.message || "Internal Server Error";

  const errors = [];

  if (err.name === "CastError") {
    statusCode = 404;
    message = "Resource not found";
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation error";
    for (const field in err.errors) {
      errors.push({ field, message: err.errors[field].message });
    }
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  } else if (err.name === "MongoError" && err.code === 11000) {
    statusCode = 400;
    message = "Duplicate key";
  } else if (err.name === "SyntaxError") {
    statusCode = 400;
    message = "Syntax error in request";
  } else if (statusCode === 429) {
    message = "Too many sign-in attempts from this IP, please try again later.";
  }
  res.status(statusCode).json({
    success: false,
    message: message,
    errors: errors,
  });
};
