const mongoose = require("mongoose")
const validator = require("validator")
const AppError = require("../utils/appError")
const Product = require("./ProductModel")
const catchAsync = require("../utils/catchAsync")

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: [true, "Role is required."],
      enum: ["seller", "buyer"],
    },
    depositedMoney: {
      type: Number,
      validate: [
        {
          // Instagram username regex https://regexr.com/3cg7r
          validator: function (v) {
            return v >= 0 && v % 5 === 0
          },
          message: "Invalid Deposit",
        },
      ],
      default: 0,
    },
    username: {
      type: String,
      trim: true,
      unique: true,
      validate: [
        {
          // Instagram username regex https://regexr.com/3cg7r
          validator: function (v) {
            return /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/gim.test(v)
          },
          message: "Invalid username",
        },
      ],
      required: [true, "Username is required."],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    passwordLastChangedAt: {
      type: Date,
      required: [true, "PasswordLastChangedAt date property must be specified"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: { createdAt: true, updatedAt: false },
  }
)

userSchema.statics.validatePassword = (password) => {
  if (!password) throw new AppError("Password must be specifed.", 400)
  if (typeof password !== "string") {
    throw new AppError("Password must be string.", 400)
  }
  if (password.length < 8 || password.length > 50) {
    throw new AppError("Password must be 8-50 characters.", 400)
  }
  return true
}

// Returns a select options object for public user
userSchema.statics.publicUser = () => {
  return {
    password: 0,
    passwordLastChangedAt: 0,
    __v: 0,
  }
}

// Returns an object contains the public user info.
userSchema.methods.toPublic = function () {
  const publicUser = this.toJSON()
  const fieldsToExclude = userSchema.statics.publicUser()

  Object.keys(publicUser).forEach((el) => {
    if (fieldsToExclude[el] === 0) {
      delete publicUser[el]
    }
  })
  return publicUser
}

// delete all products of a seller in case of delete seller
userSchema.pre("remove", { document: true }, async function (next) {
  if (this.role !== "seller") next()
  await Product.deleteMany({ sellerId: this._id })
  next()
})

const User = mongoose.model("User", userSchema)
module.exports = User
