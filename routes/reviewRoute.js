const express = require("express");
// const {
//   getBrandValidator,
//   createBrandValidator,
//   updateBrandValidator,
//   deleteBrandValidator,
// } = require("../utils/validators/brandValidator");

const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require("../services/reviewService");

const authService = require("../services/authService")

const router = express.Router();

router
  .route("/")
  .get(getReviews)
  .post(authService.protect,authService.allowedTo('user'), createReview);

router
  .route("/:id")
  .get( getReview)
  //  her user can delete or update only his review => handle in validation 
  .put(authService.protect,authService.allowedTo('user'), updateReview)
  .delete(authService.protect,authService.allowedTo('user', 'admin'), deleteReview);

module.exports = router;
