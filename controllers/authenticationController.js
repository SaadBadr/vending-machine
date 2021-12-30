const catchAsync = require("./../utils/catchAsync")
const AppError = require("../utils/appError")
const generatePasswordHashAndSalt = require("../utils/generatePasswordHashAndSalt")
const verifyPassword = require("../utils/verifyPassword")
const signJwt = require("../utils/signJwt")
const User = require("../models/UserModel")

const passport = require("passport")

// For all users
module.exports.login = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ username: req.body.username })
  if (!user) {
    // Invalid username
    throw new AppError("Invalid username or password", 401)
  }
  const isValid = await verifyPassword(req.body.password, user.password)
  if (!isValid) {
    // Invalid password
    throw new AppError("Invalid email or password", 401)
  }

  // Valid email & pass
  const tokenObject = signJwt(user._id, user.role)
  const publicUser = user.toPublic()
  res.status(200).json({
    status: "success",
    data: {
      token: tokenObject.token,
      expiresIn: tokenObject.expires,
      ...publicUser,
    },
  })
})

module.exports.signup = catchAsync(async (req, res, next) => {
  const { username, password, role } = req.body
  User.validatePassword(password) // If there is an error it would be caught by catchAsync.
  const passwordHash = await generatePasswordHashAndSalt(password)

  let newUser = new User({
    username,
    password: passwordHash,
    passwordLastChangedAt: new Date(),
    role,
  })

  newUser = await newUser.save() // If there is an error it would be caught by catchAsync.

  const tokenObject = signJwt(newUser._id, newUser.role)
  const publicUser = newUser.toPublic()
  res.status(201).json({
    status: "success",
    data: {
      token: tokenObject.token,
      expiresIn: tokenObject.expires,
      ...publicUser,
    },
  })
})

module.exports.changePassword = catchAsync(async (req, res, next) => {
  const { password } = req.body

  User.validatePassword(password) // If there is an error it would be caught by catchAsync.

  const passwordHash = await generatePasswordHashAndSalt(password)
  req.user.password = passwordHash

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: req.user.password,
      passwordLastChangedAt: new Date(),
    },
    { new: true, runValidators: true }
  )
  const tokenObject = signJwt(updatedUser._id, updatedUser.role)
  const publicUser = updatedUser.toPublic()

  res.status(200).json({
    status: "success",
    data: {
      token: tokenObject.token,
      expiresIn: tokenObject.expires,
      ...publicUser,
    },
  })
})

module.exports.protect = () => {
  return passport.authenticate("jwt", { session: false })
}

module.exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    const myRole = req.user.type

    if (!roles.includes(myRole)) {
      return next(
        new AppError(
          "You are unauthorized. This route is restricted to certain type of users.",
          401
        )
      )
    } else {
      return next()
    }
  }
}
