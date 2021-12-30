const express = require("express")
const authenticationController = require("../controllers/authenticationController")
const transactionController = require("../controllers/transactionController")

const router = express.Router()

router
  .use(
    authenticationController.protect(),
    authenticationController.restrictTo("buyer")
  )
  .post("/deposit", transactionController.deposit)
  .post("/reset", transactionController.reset)
  .post("/buy", transactionController.buy)

module.exports = router
