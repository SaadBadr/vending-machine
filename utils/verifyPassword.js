const bcrypt = require("bcrypt")

module.exports = async function validatePassword(password, passwordHash) {
  const match = await bcrypt.compare(password, passwordHash)
  return match
}
