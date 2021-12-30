const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
const fs = require("fs")
const path = require("path")
const User = require("../models/UserModel")

const keyPath = path.join(__dirname, "./keys/publicKey.pem")
const PUBLIC_KEY = fs.readFileSync(keyPath, "utf8")

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUBLIC_KEY,
  algorithms: ["RS256"],
}

module.exports = (passport) => {
  // The JWT payload is passed into the verify callback
  passport.use(
    new JwtStrategy(options, async function (payload, done) {
      try {
        const user = await User.findOne({ _id: payload.sub })
        if (user) {
          return done(null, user)
        } else {
          return done(null, false)
        }
      } catch (err) {
        return done(err, false)
      }
    })
  )
}
