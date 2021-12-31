const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const verifyPassword = require("../utils/verifyPassword")
const User = require("../models/UserModel")

module.exports.me = catchAsync(async (req, res, next) => {
  const user = req.user.toJSON()
  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    data: { user },
  })
})

module.exports.updateUser = catchAsync(async (req, res, next) => {
  // only username can be updated
  // to update password the user should use another endpoint related to auth
  if (req.body.password)
    throw new AppError(
      "Please use the apporbiate endpoint to update your password",
      400
    )

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { username: req.body.username },
    { runValidators: true, new: true }
  )
  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    data: {
      updatedUser: user.toJSON(),
    },
  })
})

module.exports.deleteUser = catchAsync(async (req, res, next) => {
  const isValid = await verifyPassword(req.body.password, req.user.password)
  if (!isValid) {
    // Invalid password
    throw new AppError("Invalid password", 401)
  }

  await req.user.remove()
  // SEND RESPONSE
  res.status(204).json({
    status: "success",
    data: { data: null },
  })
})
