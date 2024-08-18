const crypto = require("crypto");


const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const createToken = require("../utils/createToken");
const sendEmail = require("../utils/sendEmail");

const User = require("../models/userModel");

//@desc  signup
//@route post/api/vi/auth/signup
//@access public
exports.signup = asyncHandler(async (req, res, next) => {
  // 1- create a user
  const user = await User.create({
    name: req.body.name,
    password: req.body.password,
    email: req.body.email,
  });
  // 2- generate token
  const token = createToken(user._id);
  res.status(201).json({ data: user, token });
});

//@desc  lgin
//@route post/api/vi/auth/login
//@access public
exports.login = asyncHandler(async (req, res, next) => {
  // 1-check if password & email in the body (validation)
  // 2-check if user exists  & check if password is correct
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrect email or password"), 401); // better not specified the problem here
  }
  // 3- generate token
  const token = createToken(user._id);
  // delete password from response

  // 4- send res to clientside
  res.status(200).json({ data: user, token });
});

//@desc make sure the user is is logged in
exports.protect = asyncHandler(async (req, res, next) => {
  // 1) Check if token exist, if exist get
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new ApiError(
        'You are not login, Please login to get access this route',
        401
      )
    );
  }

  // 2) Verify token (no change happens, expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // 3) Check if user exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError(
        'The user that belong to this token does no longer exist',
        401
      )
    );
  }

  // 4) Check if user change his password after token created
  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    // Password changed after token created (Error)
    if (passChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          'User recently changed his password. please login again..',
          401
        )
      );
    }
  }

  req.user = currentUser;
  next();
});
//@desc Authorizatin (user permissions)
//access admin
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    //1- access roles  2- access login user (req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("you are not allowed to access this route", 403)
      ); //permission
    }
    next();
  });

//@desc Forget password
//route post /api/v1/auth/forgotPassword
// access public
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  // 1-get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError(`No user with this email ${req.body.email}`, 404)); //not found
  }
  // 2-if user exists, generate a new pass(hash rest 6 digits) & save it in DB
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString(); //??
  const hashResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  // save hashed password reset code into DB
  user.passwordResetCode = hashResetCode;
  // add expiration time for password reset code (10 min)
  user.passwordResetExpiration = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;
  await user.save();

  //send the reset password code via email
  const message = `Hi ${user.name},\n We received a request to reset the password on your E-shop Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 min)",
      message,
    });
  } catch (err) {
    //reson for try-catch  بحيث لو حصل ايرور روح امسح كل القيم الي سجلناها دي
    user.passwordResetCode = undefined;
    user.passwordResetExpiration = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    return next(new ApiError("There is an error in sending email", 500)); //problem in server
  }

  res
    .status(200)
    .json({ status: "Success", message: "Reset code sent to email" });
});

//@desc verify Reset code
//route post api/vi/auth/verifyresetcode
//access public

exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  // 1) Get user based on reset code
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(req.body.resetCode)
    .digest('hex');

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpiration: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError('Reset code invalid or expired'));
  }

  // 2) Reset code valid
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({
    status: 'Success',
  });
});

//@desc   Reset password
//route   post /api/v1/auth/resetpassword
//access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError(`No user with this email ${req.body.email}`, 404)); //not found
  }
  // check if reset code is verified
  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code is not verified", 400));
  }
  // verified
  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpiration = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  // if everything is ok, generate token
  const token = createToken(user._id);
  res.status(200).json({ status: "success", token });
});
