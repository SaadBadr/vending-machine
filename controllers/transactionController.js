const Product = require("../models/ProductModel")
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")

const {
  moneyToDiscreteCoins,
  discreteCoinsToMoney,
} = require("../utils/discreteCoins")

module.exports.deposit = catchAsync(async (req, res, next) => {
  // calculating the total deposit amount
  const deposit_amount = discreteCoinsToMoney(req.body)
  // adding the new deposit to the user's account
  req.user.depositedMoney += deposit_amount
  await req.user.save() // If there is an error it would be caught by catchAsync.

  // SEND RESPONSE
  res.status(201).json({
    status: "success",
    data: {
      totalDepositedMoney: req.user.depositedMoney,
    },
  })
})

module.exports.reset = catchAsync(async (req, res, next) => {
  // save the value of user's deposited money in depositedMoney
  const { depositedMoney } = req.user
  // reset user's deposited money
  req.user.depositedMoney = 0

  const updatedUser = await req.user.save() // If there is an error it would be caught by catchAsync.

  // SEND RESPONSE
  res.status(201).json({
    status: "success",
    data: {
      totalDepositedMoney: depositedMoney,
    },
  })
})

module.exports.buy = catchAsync(async (req, res, next) => {
  const user = req.user
  const { productId, amount } = req.body

  // return error in case of productId and amount arrays are not provided or their lengths are not same
  if (
    !productId ||
    !amount ||
    amount.length != productId.length ||
    amount.length < 1
  )
    throw new AppError("Invalid buy process! please try again.", 400)

  // get products with id in productId array
  const products = await Product.find({ _id: { $in: productId } })

  // make a dictionary that maps product id to it's required amount
  const amount_dict = {}
  productId.forEach((key, i) => (amount_dict[key] = amount[i]))

  // totalCost is used to accumulate the cost of all products
  let totalCost = 0
  // promises will include all the promises results from updating amountAvailable of each product and depositedMoney of buyer
  const promises = []

  // calculate the total cost and update amountAvailable of each product
  for (const product of products) {
    const id = product._id.toString()
    if (product.amountAvailable < amount_dict[id])
      throw new AppError(
        `Only ${product.amountAvailable} of ${product._id} is available, please update your order.`,
        400
      )
    product.amountAvailable -= amount_dict[id]
    totalCost += amount_dict[id] * product.cost
    promises.push(product.save())
  }

  // in case the total cost exceeds the deposited amount, return error
  if (totalCost > user.depositedMoney)
    throw new AppError(
      `Requested Order exceeds deposit by ${
        totalCost - user.depositedMoney
      }cent`,
      400
    )

  // convert the change into discrete coins format
  const changeAmount = user.depositedMoney - totalCost
  const change = moneyToDiscreteCoins(changeAmount)
  // update user depositedMoney to zero
  user.depositedMoney = 0
  promises.push(user.save())

  // resolve all the promises
  await Promise.all(promises)

  // SEND RESPONSE
  // return total cost, change, cart in the response
  res.status(200).json({
    status: "success",
    data: {
      totalCost,
      change,
      cart: products.map((product) => ({
        id: product._id,
        productName: product.productName,
        amount: amount_dict[product._id.toString()],
        costPerItem: product.cost,
      })),
    },
  })
})
