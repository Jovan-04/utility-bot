/*
 * created by Jovan04. last updated 11/19/2023
 * you can contact me on Discord @jovan04 (legacy - Jovan04#8647)
 * github: https://github.com/Jovan-04/
 * 
 * Minecraft Utility Bot
 */

const { readlineLog } = require("../utils")
const { GoalGetToBlock } = require('mineflayer-pathfinder').goals

module.exports = { 
  usage: 'deposit <Base>',
  description: "Deposit the bot's inventory into the chest at the specified Base",
  func: async (bot, args) => {
    // input validation
    if (!args[0] || typeof args[0] !== 'string') return readlineLog(`\u001b[91m Incorrect usage. Usage: ${module.exports.usage} \u001b[0m`)

    // check to see if the Base exists
    const bases = require('../destinations/bases.js')
    const base = bases[args[0]]
    if (!base) return readlineLog(`\u001b[91m Could not find Base ${args[1]} \u001b[0m`)

    const { x, y, z } = base.chestLocation
    let err = false
    await bot.pathfinder.goto(new GoalGetToBlock(x, y, z)).catch(e => {
      readlineLog('\u001b[91m The bot enocountered an error while traveling to the Base')
      readlineLog(e, true)
      err = true
    })

    if (err) return // this is a janky solution to safely catch pathfinder errors - i'll need to come up with a better one

    const chest = await bot.openBlock(bot.blockAt(base.chestLocation)).catch(e => {
      readlineLog('\u001b[91m The bot enocountered an error while opening the Chest')
      readlineLog(e, true)
      err = true
    })

    if (err) return

    // empty inventory into the chest, with a delay of 1/4 second between items
    for (const item of chest.items()) {
      await chest.deposit(item.type, null, item.count).catch(e => { readlineLog(e, true) })
      await bot.waitForTicks(5)
    }

    await chest.close()
  }
}