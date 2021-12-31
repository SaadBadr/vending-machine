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

  // SEND RESPONSE
  res.status(201).json({
    status: "success",
    data: {
      product: newProduct.toJSON(),
    },
  })
})

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const features = new DbQueryManager(Product.find())
  const products = await features.all(req.query)
  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    data: {
      results: products.length,
      total: await Product.count(),
      products: products.map((product) => product.toJSON()),
    },
  })
})

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id)

  if (!product) {
    throw new AppError("No product found with that ID", 404)
  }

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    data: {
      product: product.toJSON(),
    },
  })
})

// this middleware is responsible to validate that the current user is owner of the product
exports.validateSeller = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
    throw new AppError("No product found with that ID", 404)
  }

  if (!product.sellerId.equals(req.user._id)) {
    throw new AppError("You are not the owner of this product", 401)
  }

  req.product = product
  next()
})

exports.updateProduct = catchAsync(async (req, res, next) => {
  const { cost, amountAvailable, productName } = req.body
  let product = req.product

  product.cost = cost || product.cost
  product.amountAvailable = amountAvailable || product.amountAvailable
  product.productName = productName || product.productName

  product = await product.save()

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    data: {
      updatedProduct: product.toJSON(),
    },
  })
})

exports.deleteProduct = catchAsync(async (req, res, next) => {
  await req.product.remove()

  // SEND RESPONSE
  res.status(204).json({
    status: "success",
    data: {
      product: null,
    },
  })
})
