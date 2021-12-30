const express = require("express")
const authenticationController = require("../controllers/authenticationController")
const userController = require("./../controllers/userController")

const router = express.Router()

router
  .get("/me", authenticationController.protect(), userController.me)
  .put("/", userController.updateUser)
module.exports = router
