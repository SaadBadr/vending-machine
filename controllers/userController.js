const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const DbQueryManager = require("../utils/dbQueryManager")
const User = require("../models/UserModel")

module.exports.me = catchAsync(async (req, res, next) => {
  const user = req.user.toPublic()
  res.status(200).json({ status: "success", data: { data: user } })
})

module.exports.updateUser = catchAsync(async (req, res, next) => {
  if (req.body.password)
    throw new AppError(
      "Please use the apporbiate endpoint to update your password",
      400
    )
  const user = User.findOneAndUpdate(
    req.user._id,
    { username: req.body.username },
    { runValidators: true, new: true }
  )
  res.status(200).json({ status: "success", data: { data: user.toPublic() } })
})
