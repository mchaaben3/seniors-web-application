const multer = require("multer");
const cloudinary = require("cloudinary");
const Group = require("../models/group");
const Post = require("../models/post");
const User = require("../models/user");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");

//create group
exports.newGroup = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;

  const group = await Group.create(req.body);

  res.status(201).json({
    success: true,
    group,
  });
});

//get group
exports.getGroup = catchAsyncErrors(async (req, res, next) => {
  const group = await Group.findById(req.params.id);

  if (!group) {
    return next(new ErrorHandler("Group not found", 404));
  }

  res.status(200).json({
    success: true,
    group,
  });
});

//update group
exports.updateGroup = catchAsyncErrors(async (req, res, next) => {
  const group = await Group.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  //user id is not equal to the user id of the post
  if (group.user.toString() !== req.user.id) {
    return next(
      new ErrorHandler("You are not authorized to update  this group", 403)
    );
  }

  if (!group) {
    return next(new ErrorHandler("Group not found", 404));
  }

  res.status(200).json({
    success: true,
    group,
  });
});

//delete group
exports.deleteGroup = catchAsyncErrors(async (req, res, next) => {
  const group = await Group.findById(req.params.id);

  if (!group) {
    return next(new ErrorHandler("Group not found", 404));
  }
  await group.remove();
  res.status(200).json({
    success: true,
    group,
  });
});

//add member to group
exports.addMember = catchAsyncErrors(async (req, res, next) => {
  const group = await Group.findById(req.params.id);
  const user = await User.findById(req.params.userId);
  if (!group) {
    return next(new ErrorHandler("Group not found", 404));
  }
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  group.members.push(user);
  await group.save();
  res.status(200).json({
    success: true,
    group,
  });
});

//remove member from group
exports.removeMember = catchAsyncErrors(async (req, res, next) => {
  const group = await Group.findById(req.params.id);
  const user = await User.findById(req.params.userId);
  if (!group) {
    return next(new ErrorHandler("Group not found", 404));
  }
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  group.members.pull(user);
  await group.save();
  res.status(200).json({
    success: true,
    group,
  });
});

//create  post in group
exports.createPost = catchAsyncErrors(async (req, res, next) => {
    const group = await Group.findById(req.params.id);
    if (!group) {
        return next(new ErrorHandler("Group not found", 404));
        }
        req.body.category='group';
        const post = await Post.create(req.body);
        group.posts.push(post);
        await group.save();
        res.status(201).json({
            success: true,
            group,
        });
    });

//get all posts in group
exports.getAllPosts = catchAsyncErrors(async (req, res, next) => {
    const group = await Group.findById(req.params.id);
    if (!group) {
        return next(new ErrorHandler("Group not found", 404));
    }
    const posts = await Post.find({ category: 'group', group: group._id });
    res.status(200).json({
        success: true,
        posts,
    });
    });

