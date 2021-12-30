const jsonwebtoken = require("jsonwebtoken")
const fs = require("fs")
const path = require("path")

const keyPath = path.join(__dirname, "../config/keys/privateKey.pem")
const PRIVATE_KEY = fs.readFileSync(keyPath, "utf8")

module.exports = function signJwt(id, role) {
  const payload = {
    sub: id,
    iat: Math.floor(new Date() / 1000), // Must be in seconds VIPPPPP!!!
    role,
  }

  const signedToken = jsonwebtoken.sign(payload, PRIVATE_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN, // Must be in milliseconds,
    algorithm: "RS256",
  })

  return {
    token: "Bearer " + signedToken,
    expires: process.env.JWT_EXPIRES_IN,
  }
}
