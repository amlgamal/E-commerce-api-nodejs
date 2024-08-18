const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const User = require("../models/userModel");
const factory = require("./handlersFactory");
const ApiError = require("../utils/apiError");
const createToken = require("../utils/createToken");

// desc    Get list of users
// route   GET /api/v1/users
// access  Public
exports.getUsers = factory.getAll(User);

// desc    Get specific user by id
// route   GET /api/v1/users/:id
// access  Public
exports.getUser = factory.getOne(User);

// desc    Create user
// route   POST  /api/v1/users
// access  Private
exports.createUser = factory.createOne(User);

// desc    Update specific user (without password)
// route   PUT /api/v1/users/:id
// access  Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      // why here doesn't use one thing instead of all this stuff
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      role: req.body.role,
    },
    { new: true }
  );
  if (!document) {
    return next(new ApiError(`No user for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

// update password
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );
  if (!document) {
    return next(new ApiError(`No user for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

// desc    Delete specific user
// route   DELETE /api/v1/users/:id
// access  Private
exports.deleteUser = factory.deleteOne(User);

// desc    Get logged user
// route   GET /api/v1/users/getMe
// access  privet
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// desc    update logged user password
// route   put /api/v1/users/updateMyPassword
// access  privet

exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  // 1) Update user password based user payload (req.user._id)
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );
  //generate token
  const token = createToken(user._id);
  res.status(200).json({ data: user, token });
});

// desc update logged user data (without password)
// route put /api/v1/users/updateMe
// access private
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true }
  );

  res.status(200).json({ data: updatedUser });
});

// desc deactivete lgged user
// route delete /api/v1/users/deleteMe
// access private
exports.deleteLoggedUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(200).json({ status: "success" });
});

// desc activate user
// route update /api/v1/users/activateMe
exports.activateUser = asyncHandler(async (req, res, next) => {
  const activateUser = await User.findByIdAndUpdate(
    req.user._id,
    { active: true },
    { new: true }
  );
  res.status(200).json({ data: activateUser });
});
