const ErrorHandler=require('../utils/errorHandler');
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "DEVELOPEMENT") {
    res.status(err.statusCode).json({
      success: false,
      errMessage: err.message,
      error: err,
      stack: err.stack,
    });
  }
  if (process.env.NODE_ENV === "PRODUCTION") {
    let error = { ...err };
    error.message = err.message;

    //wrong Mongoose ObjectId Error 
    if (err.name === "CastError") {
      const message = `Resource not found with id of ${err.path}`;
      error = new ErrorHandler(message, 400);
    }
    //Handling Mongoose Validation Error
    if (err.name === "ValidationError") {
      const message=Object.values(err.errors).map((val)=>val.message);
      error = new ErrorHandler(message, 400);
    }
//Handling Mongoose duplicate key error
    if (err.code === 11000) {
      const message = `Duplicate field value entered`;
      error = new ErrorHandler(message, 400);
    }

    //Handling JWT Token Error
    if (err.name === "JsonWebTokenError") {
      const message = `Invalid token`;
      error = new ErrorHandler(message, 401);
    }
    //Handling Expired Token Error
    if (err.name === "TokenExpiredError") {
      const message = `Token expired`;
      error = new ErrorHandler(message, 401);
    }
    


    res.status(error.statusCode).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};
