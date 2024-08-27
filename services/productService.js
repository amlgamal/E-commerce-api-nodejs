
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const { uploadMixOfImages } =require('../middlewares/uploadImageMiddleware')

const factory = require("./handlersFactory");
const Product = require("../models/productModel");


exports.uploadProductImage = uploadMixOfImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 7 },
]);

exports.resizeProductImg = asyncHandler(async (req, res, next) => {
  //console.log(req.files)
  //1- img processing for cover

  if (req.files.imageCover) {
    const imageCoverfilename = `product-${uuidv4()}-${Date.now()}-Cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${imageCoverfilename}`);

    // update the req.body with the new image imageCoverfilename
    req.body.imageCover = imageCoverfilename;
  }
  //2- img processing for images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imagesfilename = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`uploads/products/${imagesfilename}`);

        // update the req.body with the new image imageCoverfilename
        req.body.images.push(imagesfilename);
      })
    );
    next();
  }
});

// @desc    Get list of product
// @route   GET /api/v1/product
// @access  Public
exports.getproducts = factory.getAll(Product, "product");

// @desc    Get specific product by id
// @route   GET /api/v1/products/:id
// @access  Public
exports.getproduct = factory.getOne(Product);

// @desc    Create product
// @route   POST  /api/v1/products
// @access  Private
exports.createproduct = factory.createOne(Product);

// @desc    Update specific product
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateproduct = factory.updateOne(Product);

// @desc    Delete specific product
// @route   DELETE /api/v1/products/:id
// @access  Private
exports.deleteproduct = factory.deleteOne(Product);
