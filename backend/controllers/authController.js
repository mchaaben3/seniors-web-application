const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const User = require("../models/user");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require('../utils/JWT');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

exports.registerUser = catchAsyncErrors(async (req, res, next) => {

    const { name, email, password, role } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: 'v1643894684/anonyme_v2cws7',
            url: 'https://res.cloudinary.com/dp81gikbd/image/upload/v1643894684/anonyme_v2cws7.png'
        }
        });
    const token  = user.getJWT();

    sendToken(user, 200, res);

});

//Login user => /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return next(new ErrorHandler('Please provide email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if(!user || !(await user.correctPassword(password, user.password))) {
        return next(new ErrorHandler( 'Incorrect email or password', 400));
    }

    const token = user.getJWT();
    sendToken(user, 200, res);
});
//reset password => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    // Hash password
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpires: { $gt: Date.now() }
    });
  console.log(user)
    if(!user){
        return next(new ErrorHandler('Invalid token', 400));
    }
    if(req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Passwords do not match', 400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    sendToken(user, 200, res);
});


//forgot password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if(!user) {
        return next(new ErrorHandler( 'There is no user with this email', 404));}
        //get reset Token
        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        //create reset url
        const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;
         const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;
            const subject = 'SHOP APP Password reset token';
            try {
                await sendEmail({
                    email: user.email,
                    subject,
                    message
                });
                res.status(200).json({
                    status: 'success',
                    message: `email sent to ${user.email}`
                });
            } catch (err) {
                user.resetPasswordToken = undefined;
                user.resetPasswordExpire = undefined;
                await user.save({ validateBeforeSave: false });
                console.log(err)
                return next(new ErrorHandler( 'Email could not be sent', 500));
                
            }
});


//logout user => /api/v1/logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now()),
        httpOnly: true
    });
    res.status(200).json({
        success: true,
        message: 'Logout success'
    });
});

//get current user => /api/v1/me
exports.getCurrentUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
       user
    });
});

// Update / Change password => /api/v1/me/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');
    if(!user || !(await user.correctPassword(req.body.currentPassword, user.password))) {
        return next(new ErrorHandler( 'Current password is incorrect', 401));
    }
    user.password = req.body.newPassword;
    await user.save();
    sendToken(user, 200, res);
});


//update User profile => /api/v1/me/update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        user
    });
});

//get all users => /api/v1/admin/users
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users
    });
});


// Get user details => /api/v1/admin/users/:id
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler( 'User not found', 404));
    }
    res.status(200).json({
        success: true,
        user
    });
});