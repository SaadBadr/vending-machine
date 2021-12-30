const express = require("express")
const authenticationController = require("./../controllers/authenticationController")

const router = express.Router()

// router.post("/signup", authenticationController.protect(), authenticationController.restrictTo( "Admin"), authenticationController.signup);
router.post("/signup", authenticationController.signup)
router.post("/login", authenticationController.login)
router.put(
  "/change-password",
  authenticationController.protect(),
  authenticationController.changePassword
)

module.exports = router
