const express = require("express")
const authenticationController = require("../controllers/authenticationController")
const userController = require("./../controllers/userController")

const router = express.Router()

router
  .use(authenticationController.protect())
  .get("/me", userController.me)
  .put("/", userController.updateUser)
  .delete("/", userController.deleteUser)
module.exports = router
