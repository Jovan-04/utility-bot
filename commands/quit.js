/*
 * created by Jovan04. last updated 09/30/2023
 * you can contact me on Discord @jovan04 (legacy - Jovan04#8647)
 * github: https://github.com/Jovan-04/
 * 
 * Minecraft Utility Bot
 */

const { readlineLog } = require("../utils")

module.exports = (bot, args) => {
  readlineLog("\u001b[36m Exiting...\u001bn[0m")
  bot.quit(args.join(' '))
  process.exit(1)
}