const mongoose = require("mongoose")
const AppError = require("../utils/appError")

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      trim: true,
      required: [true, "Product name is required."],
    },
    amountAvailable: {
      type: Number,
      min: [0, "the available amount should be at least 0."],
      default: 0,
    },
    cost: {
      type: Number,
      validate: [
        {
          // Instagram username regex https://regexr.com/3cg7r
          validator: function (v) {
            return v > 0 && v % 5 === 0
          },
          message: "Invalid Cost.",
        },
      ],
      required: [true, "Cost is required."],
    },
    sellerId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: { createdAt: true, updatedAt: false },
  }
)

const Product = mongoose.model("Product", productSchema)
module.exports = Product
