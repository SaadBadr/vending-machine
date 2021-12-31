const mongoose = require("mongoose")
const AppError = require("../utils/appError")
const Product = require("./ProductModel")

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
          validator: function (v) {
            return v >= 0 && v % 5 === 0
          },
          message: "Invalid Deposit",
        },
      ],
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

// Returns an object contains the public user info.
userSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    ret.id = ret._id
    delete ret.password
    delete ret.passwordLastChangedAt
    delete ret._id
    delete ret.__v
  },
})

// For new users, assign 0 as depositedMoney for buyers and undefined for sellers
userSchema.pre(/^save/, { document: true }, function (next) {
  if (this.isNew) this.depositedMoney = this.role === "seller" ? undefined : 0
  next()
})

// Delete all products of a seller in case of delete seller
userSchema.pre("remove", { document: true }, async function (next) {
  if (this.role !== "seller") next()
  await Product.deleteMany({ sellerId: this._id })
  next()
})

const User = mongoose.model("User", userSchema)
module.exports = User
