const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const Product = require("../models/ProductModel")

module.exports.deposit = catchAsync(async (req, res, next) => {
  const cent_10 = req.body["10cent"] || 0
  const cent_20 = req.body["20cent"] || 0
  const cent_50 = req.body["50cent"] || 0
  const cent_100 = req.body["100cent"] || 0

  const deposit_amount =
    10 * cent_10 + 20 * cent_20 + 50 * cent_50 + 100 * cent_100

  req.user.depositedMoney += deposit_amount
  console.log(req.user.depositedMoney)
  const updatedUser = await req.user.save() // If there is an error it would be caught by catchAsync.

  res.status(201).json({
    status: "success",
    data: {
      data: updatedUser.toPublic(),
    },
  })
})

module.exports.reset = catchAsync(async (req, res, next) => {
  const { depositedMoney } = req.user
  req.user.depositedMoney = 0

  const updatedUser = await req.user.save() // If there is an error it would be caught by catchAsync.

  res.status(201).json({
    status: "success",
    data: {
      depositedMoney,
    },
  })
})

module.exports.buy = catchAsync(async (req, res, next) => {
  const user = req.user
  const { productId, amount } = req.body

  if (
    !productId ||
    !amount ||
    amount.length != productId.length ||
    amount.length < 1
  )
    throw new AppError("Invalid buy process! please try again.", 400)

  const products = await Product.find({ _id: { $in: productId } })

  amount_dict = {}

  productId.forEach((key, i) => (amount_dict[key] = amount[i]))
  total_cost = 0
  const promises = []

  for (const product of products) {
    const id = product._id.toString()
    if (product.amountAvailable < amount_dict[id])
      throw new AppError(
        `Only ${product.amountAvailable} of ${product._id} is available, please update your order.`,
        400
      )
    product.amountAvailable -= amount_dict[id]
    total_cost += amount_dict[id] * product.cost
    promises.push(product.save())
  }

  if (total_cost > user.depositedMoney)
    throw new AppError(
      `Requested Order exceeds deposit by ${
        total_cost - user.depositedMoney
      }cent`,
      400
    )

  change_amount = user.depositedMoney - total_cost
  const change = {}

  const coins = [100, 50, 20, 10, 5]
  let i = 0
  while (change_amount && i < coins.length) {
    if (change_amount >= coins[i]) {
      change[coins[i] + "cent"] = Math.floor(change_amount / coins[i])
      change_amount -= change[coins[i] + "cent"] * coins[i]
    }
    i++
  }
  user.depositedMoney = 0
  promises.push(user.save())

  await Promise.all(promises)

  res.status(200).json({
    status: "success",
    data: {
      total_cost,
      change,
      cart: products.map((product) => ({
        id: product._id,
        productName: product.productName,
        amount: amount_dict[product._id.toString()],
        cost_per_item: product.cost,
      })),
    },
  })
})
