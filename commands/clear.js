/*
 * created by Jovan04. last updated 11/18/2023
 * you can contact me on Discord @jovan04 (legacy - Jovan04#8647)
 * github: https://github.com/Jovan-04/
 * 
 * Minecraft Utility Bot
 */

const { readlineLog } = require("../utils")

module.exports = { 
  usage: 'clear',
  description: 'Clear the console',
  func: (bot, args) => {
    console.clear()
    readlineLog('')
  }
}