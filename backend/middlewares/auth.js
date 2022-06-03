const catchAsyncErrors = require('./catchAsyncErrors')
const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler');
const jwt = require('jsonwebtoken');

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const {token}=req.cookies;
    if(!token) return next(new ErrorHandler('You are not logged in', 401));
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
});

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler('You are not authorized to perform this action', 403));
        }
        next();
    }
}