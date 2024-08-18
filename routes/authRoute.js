const express = require("express");

const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/authValidator");

const {
  signup,
  login,
  forgetPassword,
  verifyPassResetCode,
  resetPassword,
} = require("../services/authService");

const router = express.Router();

router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);
router.post("/forgetpassword", forgetPassword);
router.post("/verifyresetcode", verifyPassResetCode);
router.put("/resetpassword", resetPassword);

module.exports = router;
