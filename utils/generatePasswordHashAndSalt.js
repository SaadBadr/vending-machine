const bcrypt = require("bcrypt")

module.exports = async function generatePasswordHashAndSalt(password) {
  const passwordHash = await bcrypt.hash(password, 1024) // Generates a string consists of a hash and a salt
  return passwordHash
}
