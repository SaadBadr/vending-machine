const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const DbQueryManager = require("../utils/dbQueryManager")
const User = require("../models/UserModel")

module.exports.me = catchAsync(async (req, res, next) => {
  const user = req.user.toJSON()
  res.status(200).json({ status: "success", data: { user } })
})

module.exports.updateUser = catchAsync(async (req, res, next) => {
  if (req.body.password)
    throw new AppError(
      "Please use the apporbiate endpoint to update your password",
      400
    )
  const user = await User.findOneAndUpdate(
    req.user._id,
    { username: req.body.username },
    { runValidators: true, new: true }
  )
  res
    .status(200)
    .json({ status: "success", data: { updatedUser: user.toJSON() } })
})

module.exports.deleteUser = catchAsync(async (req, res, next) => {
  await req.user.remove()
  res.status(204).json({ status: "success", data: { data: null } })
})
