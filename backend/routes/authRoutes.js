const express = require('express');
const router=express.Router();

const {registerUser, loginUser, logout, forgotPassword, resetPassword, getCurrentUser, updatePassword, updateProfile, getAllUsers, getUserDetails} = require('../controllers/authController');
const {isAuthenticated, authorize} = require('../middlewares/auth')
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logout);

router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);

router.route('/me').get(isAuthenticated, getCurrentUser);
router.route('/password/update').put(isAuthenticated, updatePassword);
router.route('/me/update').put(isAuthenticated, updateProfile);
router.route('/admin/users').get(isAuthenticated,authorize('admin'), getAllUsers);
router.route('/admin/users/:id').get(isAuthenticated,authorize('admin'), getUserDetails);


module.exports = router;