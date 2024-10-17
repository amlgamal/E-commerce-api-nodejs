const asyncHandler = require("express-async-handler");

const factory = require("./handlersFactory");
const Review = require("../models/reviewModel");


// desc    Get list of Reviews
// route   GET /api/v1/Reviews
// access  Public
exports.getReviews = factory.getAll(Review)

// desc    Get specific Review by id
// route   GET /api/v1/Reviews/:id
// access  Public
exports.getReview = factory.getOne(Review)

// desc    Create Review
// route   POST  /api/v1/Reviews
// access  Private- User
exports.createReview = factory.createOne(Review)

// desc    Update specific Review
// route   PUT /api/v1/Reviews/:id
// access  Private - User
exports.updateReview = factory.updateOne(Review)

// desc    Delete specific Review
// route   DELETE /api/v1/Reviews/:id
// access  Private - User - Admin
exports.deleteReview = factory.deleteOne(Review);
