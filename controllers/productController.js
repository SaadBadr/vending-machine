const catchAsync = require("./../utils/catchAsync")
const AppError = require("../utils/appError")
const Product = require("../models/ProductModel")
const DbQueryManager = require("./../utils/dbQueryManager")

module.exports.createProduct = catchAsync(async (req, res, next) => {
  const { cost, amountAvailable, productName } = req.body
  const sellerId = req.user._id

  let newProduct = new Product({
    cost,
    amountAvailable,
    productName,
    sellerId,
  })

  newProduct = await newProduct.save() // If there is an error it would be caught by catchAsync.

  res.status(201).json({
    status: "success",
    data: {
      data: newProduct,
    },
  })
})

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const features = new DbQueryManager(Product.find())
  const products = await features.all(req.query)
  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      data: products,
      total: await Product.count(),
    },
  })
})

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id)

  if (!product) {
    throw new AppError("No product found with that ID", 404)
  }

  res.status(200).json({
    status: "success",
    data: {
      data: product,
    },
  })
})
