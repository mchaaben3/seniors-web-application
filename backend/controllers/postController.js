const multer = require("multer");
const cloudinary = require("cloudinary");
const Post = require("../models/post");
const User = require("../models/user");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");


exports.newPost = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;

  const post = await Post.create(req.body);

  res.status(201).json({
    success: true,
    post,
  });
});

exports.getPost = catchAsyncErrors(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorHandler("Post not found", 404));
  }

  res.status(200).json({
    success: true,
    post,
  });
});

exports.updatePost = catchAsyncErrors(async (req, res, next) => {
  console.log(req.user.id);
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  //user id is not equal to the user id of the post
  if (post.user.toString() !== req.user.id) {
    return next(
      new ErrorHandler("You are not authorized to update  this post", 403)
    );
  }

  if (!post) {
    return next(new ErrorHandler("Post not found", 404));
  }

  res.status(200).json({
    success: true,
    post,
  });
});

exports.deletePost = catchAsyncErrors(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorHandler("Post not found", 404));
  }
  console.log(req.user.role);
  if (post.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorHandler("You are not authorized to delete this post", 403)
    );
  }
  await post.remove();
  res.status(200).json({
    success: true,
    message: "deletion success",
  });
});

exports.getAllPostsByUser = catchAsyncErrors(async (req, res, next) => {
    const posts = await Post.find({ user: req.params.id, category:'general' });
    const postCount = await Post.countDocuments({ user: req.params.id });
    if (!posts) {
        return next(new ErrorHandler("Post not found", 404));
    }
    
    res.status(200).json({
        success: true,
        postCount,
        posts
    });
    });

    exports.likePost = catchAsyncErrors(async (req, res, next) => {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return next(new ErrorHandler("Post not found", 404));
        }
        if (post.likes.filter((like) => like.user.toString() === req.user.id).length > 0) {
            return next(new ErrorHandler("You have already liked this post", 400));
        }
        post.likes.unshift({ user: req.user.id });
        await post.save();
        res.status(200).json({
            success: true,
            post
        });
    });

    exports.unlikePost = catchAsyncErrors(async (req, res, next) => {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return next(new ErrorHandler("Post not found", 404));
        }
        if (post.likes.filter((like) => like.user.toString() === req.user.id).length === 0) {
            return next(new ErrorHandler("You have not yet liked this post", 400));
        }
        const removeIndex = post.likes.map((like) => like.user.toString()).indexOf(req.user.id);
        post.likes.splice(removeIndex, 1);
        await post.save();
        res.status(200).json({
            success: true,
            post
        });
    });
//add comment to a post
exports.addComment = catchAsyncErrors(async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        return next(new ErrorHandler("Post not found", 404));
    }
    post.comments.unshift(req.body);
    await post.save();
    res.status(200).json({
        success: true,
        post,
    });
    });
    exports.deleteComment = catchAsyncErrors(async (req, res, next) => {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return next(new ErrorHandler("Post not found", 404));
        }
        console.log(post.comments[0]._id.toString() )
        console.log(req.user.id)
        if (post.comments.filter((comment) => comment._id.toString() === req.user.id).length === 0) {
            return next(new ErrorHandler("You are not authorized to delete this comment", 400));
        }
        const removeIndex = post.comments.map((comment) => comment.user.toString()).indexOf(req.user.id);
        post.comments.splice(removeIndex, 1);
        await post.save();
        res.status(200).json({
            success: true,
            post,
        });
    });

    exports.getAllPosts = catchAsyncErrors(async (req, res, next) => {
        const posts = await Post.find({category:'general'});
        if (!posts) {
            return next(new ErrorHandler("No posts yet !", 404));
        }
        res.status(200).json({
            success: true,
            posts,
        });
    });


