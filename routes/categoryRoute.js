const express = require('express');
const {
    getCategoryValidator ,
    createCategoryValidator , 
    updateCategoryValidator , 
    deleteCategoryValidator,
} = require('../utils/validators/categoryValidator')

// why {getCategory} ----> without it get an error
const {
    getCategories,
    getCategory,
    createCategory ,
    updateCategory ,
    deleteCategory,
} = require('../services/categoryService') ; 
const subcategoriesRoute = require('./subCategoryRoutes');

const router = express.Router();
// if you will access this route => take him to this subcategory route
router.use('/:categoryId/subcategories', subcategoriesRoute);

router.route('/').get(getCategories).post(createCategoryValidator,createCategory);

router.route('/:id')
   .get(getCategoryValidator , getCategory)
   .put(updateCategoryValidator ,updateCategory)
   .delete(deleteCategoryValidator , deleteCategory);

module.exports = router ; 