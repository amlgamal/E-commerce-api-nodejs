const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const {uploadSingleImage} = require("../middlewares/uploadImageMiddleware")
const factory = require("./handlersFactory");
const Brand = require("../models/brandModel");

// upload a single image
exports.uploadCategoryImg = uploadSingleImage('image')

// image processing
exports.resizeImg = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(400, 400)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${filename}`);

    // update the req.body with the new image filename
  req.body.image = filename;
  next();
});

// desc    Get list of brands
// route   GET /api/v1/brands
// access  Public
exports.getBrands = factory.getAll(Brand)

// desc    Get specific brand by id
// route   GET /api/v1/brands/:id
// access  Public
exports.getBrand = factory.getOne(Brand)

// desc    Create brand
// route   POST  /api/v1/brands
// access  Private
exports.createBrand = factory.createOne(Brand)

// desc    Update specific brand
// route   PUT /api/v1/brands/:id
// access  Private
exports.updateBrand = factory.updateOne(Brand)

// desc    Delete specific brand
// route   DELETE /api/v1/brands/:id
// access  Private
exports.deleteBrand = factory.deleteOne(Brand);
