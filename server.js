// Include modules:-
// -----------------------------------------------------------------
const dotenv = require("dotenv")

// Read config file
// -----------------------------------------------------------------
dotenv.config({
  path: "./config.env",
})

// Modules that require dotenv to be defined
// -----------------------------------------------------------------
const logger = require("./utils/logger")
const connectDB = require("./config/connectDB")
// Main
// -----------------------------------------------------------------
;(async () => {

  await connectDB()

  // Initialize global variables from DB.
  await require("./utils/initializeGlobalData")()

  const app = require("./app")
  const port = process.env.PORT || 3000

  const server = app.listen(port, () => {
    logger.log("info", `✅ App is running now on port ${port}...`)
  })

  // Handle unhandled errors:-
  // -----------------------------------------------------------------
  process.on("unhandledRejection", (err) => {
    logger.log(
      "error",
      ` An unhandled rejection is thrown but caught by process.on('unhandledRejection') `
    )
    logger.log("error", err)
    server.close(() => {
      process.exit(1)
    })
  })

  process.on("uncaughtException", (err) => {
    logger.log(
      "error",
      ` An uncaught exception is thrown but caught by process.on('uncaughtException') `
    )
    logger.log("error", err)
    server.close(() => {
      process.exit(1)
    })
  })

  process.on("warning", (e) => {
    logger.log(
      "warn",
      ` A warning is thrown but caught by process.on('warn') `,
      { stack: e.stack }
    )
  })

  process.on("SIGTERM", () => {
    logger.log("error", ` SIGTERM caught by process.on('SIGTERM') `)

    server.close(() => {
      process.exit(0)
    })
  })
})()
