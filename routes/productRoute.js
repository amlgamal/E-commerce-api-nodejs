const express = require("express");
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");

const {
  getproducts,
  getproduct,
  createproduct,
  updateproduct,
  deleteproduct,
  uploadProductImage,
  resizeProductImg,
} = require("../services/productService");

const authService = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .get(getproducts)
  .post(
    authService.protect,
    authService.allowedTo("admin"),
    uploadProductImage,
    resizeProductImg,
    createProductValidator,
    createproduct
  );

router
  .route("/:id")
  .get(getProductValidator, getproduct)
  .put(
    authService.protect,
    authService.allowedTo("admin"),
    uploadProductImage,
    resizeProductImg,
    updateProductValidator,
    updateproduct
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteProductValidator,
    deleteproduct
  );

module.exports = router;
