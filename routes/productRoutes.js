const express = require("express")
const authenticationController = require("../controllers/authenticationController")
const productController = require("./../controllers/productController")

const router = express.Router()

router
  .route("/")
  .get(authenticationController.protect(), productController.getAllProducts)
  .post(
    authenticationController.protect(),
    authenticationController.restrictTo("seller"),
    productController.createProduct
  )

router
  .route("/:id")
  .get(authenticationController.protect(), productController.getProduct)

module.exports = router
