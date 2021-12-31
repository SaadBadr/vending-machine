// Handles Errors In ExpressJs Async Middlewares. It Throws The Errors To The Next Function Which Is Then Handled By ExpressJs.
const AppError = require("./appError")

const coins_values = [100, 50, 20, 10, 5]

module.exports.moneyToDiscreteCoins = (money) => {
  const coins = {}
  let i = 0
  while (money && i < coins_values.length) {
    if (money >= coins_values[i]) {
      coins[coins_values[i] + "cent"] = Math.floor(money / coins_values[i])
      money -= coins[coins_values[i] + "cent"] * coins_values[i]
    }
    i++
  }
  return coins
}
module.exports.discreteCoinsToMoney = (coins) => {
  // calculating the total amount
  let money = 0
  for (const coin of coins_values) {
    if (!coins[coin + "cent"]) continue
    if (!Number.isInteger(1 * coins[coin + "cent"]) || coins[coin + "cent"] < 0)
      throw new AppError(
        "Invalid deposit, please make sure to deposit only positive integer amount of coins.",
        400
      )
    money += coins[coin + "cent"] * coin
  }

  return money
}
