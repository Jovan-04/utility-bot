/*
 * created by Jovan04. last updated 09/29/2023
 * you can contact me on Discord @jovan04 (legacy - Jovan04#8647)
 * github: https://github.com/Jovan-04/
 * 
 * Minecraft Utility Bot
 */

const readline = require('readline')


const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function readlineLog(message) {
  readline.moveCursor(process.stdout, -2, 0) // we move the cursor to the left two places because our cursor is already two positions in (because of the input arrow)
  console.log(message)
  rl.prompt() // regenerate our little arrow on the input line
}


module.exports = {
  sleep,
  readlineLog
}