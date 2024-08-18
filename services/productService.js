const Product = require("../models/productModel");
const factory = require('./handlersFactory')

// @desc    Get list of product
// @route   GET /api/v1/product
// @access  Public
exports.getproducts = factory.getAll(Product , 'product')

// @desc    Get specific product by id
// @route   GET /api/v1/products/:id
// @access  Public
exports.getproduct = factory.getOne(Product)

// @desc    Create product
// @route   POST  /api/v1/products
// @access  Private
exports.createproduct = factory.createOne(Product)

// @desc    Update specific product
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateproduct = factory.updateOne(Product)

// @desc    Delete specific product
// @route   DELETE /api/v1/products/:id
// @access  Private
exports.deleteproduct = factory.deleteOne(Product);

