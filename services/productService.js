const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

const Product = require("../models/productModel");

// @desc    Get list of product
// @route   GET /api/v1/product
// @access  Public
exports.getproducts = asyncHandler(async (req, res) => {
  // 1)filtering
  const queryStringObj = { ...req.query };
  const excludeFields = ["page", "sort", "limit", "fields"];
  excludeFields.forEach((field) => delete queryStringObj[field]);
  //filtering using [gte , gt , lte , lt]
  let queryStr = JSON.stringify(queryStringObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  // 2)pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 50;
  const skip = (page - 1) * limit;
  //Build query
  let mongooseQuery = Product.find(JSON.parse(queryStr)) //1-filterObiect 2-chain method(.where().equal())
    .skip(skip)
    .limit(limit)
    .populate({ path: "category", select: "name -_id" });

  // 3)sorting
if(req.query.sort){
  const sortBy = req.query.sort.split(',').join(' ');
  mongooseQuery = mongooseQuery.sort(sortBy);
}else{
  mongooseQuery = mongooseQuery.sort("_createAt")
}

  //Execute query
  const products = await mongooseQuery;

  res.status(200).json({ results: products.length, page, data: products });
});

// @desc    Get specific product by id
// @route   GET /api/v1/products/:id
// @access  Public
exports.getproduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate({
    path: "category",
    select: "name",
  });
  if (!product) {
    return next(new ApiError(`No product for this id ${id}`, 404));
  }
  res.status(200).json({ data: product });
});

// @desc    Create product
// @route   POST  /api/v1/products
// @access  Private
exports.createproduct = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.title);
  const product = await Product.create(req.body);
  res.status(201).json({ data: product });
});

// @desc    Update specific product
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateproduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  //it is  not necessarily to update title each time
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }

  const product = await Product.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });

  if (!product) {
    return next(new ApiError(`No category for this id ${id}`, 404));
  }
  res.status(200).json({ data: product });
});

// @desc    Delete specific product
// @route   DELETE /api/v1/products/:id
// @access  Private
exports.deleteproduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    return next(new ApiError(`No product for this id ${id}`, 404));
  }
  res.status(204).send();
});
