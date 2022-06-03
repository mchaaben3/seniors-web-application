const multer = require("multer");
const cloudinary = require("cloudinary");
const Event = require("../models/group");
const Post = require("../models/post");
const User = require("../models/user");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");

exports.addEvent = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;

  const event = await Event.create(req.body);

  res.status(201).json({
    success: true,
    event,
  });
});

exports.getEvent = catchAsyncErrors(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new ErrorHandler("Event not found", 404));
  }

  res.status(200).json({
    success: true,
    event,
  });
});

exports.updateEvent = catchAsyncErrors(async (req, res, next) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  //user id is not equal to the user id of the post
  if (event.user.toString() !== req.user.id) {
    return next(
      new ErrorHandler("You are not authorized to update  this event", 403)
    );
  }

  if (!event) {
    return next(new ErrorHandler("Event not found", 404));
  }

  res.status(200).json({
    success: true,
    event,
  });
});

exports.deleteEvent = catchAsyncErrors(async (req, res, next) => {
  const event = await Event.findByIdAndDelete(req.params.id);

  if (!event) {
    return next(new ErrorHandler("Event not found", 404));
  }

  res.status(200).json({
    success: true,
    event,
  });
});

exports.getEvents = catchAsyncErrors(async (req, res, next) => {
  const events = await Event.find();

  if (!events) {
    return next(new ErrorHandler("Events not found", 404));
  }

  res.status(200).json({
    success: true,
    events,
  });
});



exports.joinEvent = catchAsyncErrors(async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  const user = await User.findById(req.user.id);
  if (!event) {
    return next(new ErrorHandler("Event not found", 404));
  }
  if (event.users.includes(user.id)) {
    return next(new ErrorHandler("You have already joined this event", 403));
  }
  event.users.push(user.id);
  await event.save();
  res.status(200).json({
    success: true,
    event,
  });
});

//get events by user
exports.getEventsByUser = catchAsyncErrors(async (req, res, next) => {
  const events = await Event.find({ user: req.user.id });
  if (!events) {
    return next(new ErrorHandler("Event not found", 404));
  }
  res.status(200).json({
    success: true,
    events,
  });
});

//get events by date
exports.getEventsByDate = catchAsyncErrors(async (req, res, next) => {
  const events = await Event.find({ date: req.params.date });
  if (!events) {
    return next(new ErrorHandler("Event not found", 404));
  }
  res.status(200).json({
    success: true,
    events,
  });
});

//get events by location
exports.getEventsByLocation = catchAsyncErrors(async (req, res, next) => {
  const events = await Event.find({ location: req.params.location });
  if (!events) {
    return next(new ErrorHandler("Event not found", 404));
  }
  res.status(200).json({
    success: true,
    events,
  });
});

//get members of an event
exports.getMembers = catchAsyncErrors(async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    return next(new ErrorHandler("Event not found", 404));
  }
  res.status(200).json({
    success: true,
    event,
  });
});