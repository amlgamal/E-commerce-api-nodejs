const express = require("express");

const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");

// why {getCategory} ----> without it get an error
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImg,
  resizeImg,
} = require("../services/categoryService");

const authService = require("../services/authService");
const subcategoriesRoute = require("./subCategoryRoutes");

const router = express.Router();
// if you will access this route => take him to this subcategory route
router.use("/:categoryId/subcategories", subcategoriesRoute);

router.route("/").get(getCategories).post(
  authService.protect,
  authService.allowedTo("admin"),
  uploadCategoryImg, //multer middleware for image upload
  resizeImg,
  createCategoryValidator,
  createCategory
);

router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    authService.protect,
    authService.allowedTo("admin"),
    uploadCategoryImg,
    resizeImg,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteCategoryValidator,
    deleteCategory
  );

module.exports = router;
