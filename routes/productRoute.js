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

const router = express.Router();

router
  .route("/")
  .get(getproducts)
  .post(
    uploadProductImage,
    resizeProductImg,
    createProductValidator,
    createproduct
  );

router
  .route("/:id")
  .get(getProductValidator, getproduct)
  .put(
    uploadProductImage,
    resizeProductImg,
    updateProductValidator,
    updateproduct
  )
  .delete(deleteProductValidator, deleteproduct);

module.exports = router;
