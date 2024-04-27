//middleware ==> catch errors from rules if exist
//find the validation errors in this request & wraps them in an object with handy fun
const { validationResult } = require("express-validator");

const validatorMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  // how dare really
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
module.exports = validatorMiddleware;
