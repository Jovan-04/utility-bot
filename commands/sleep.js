/*
 * created by Jovan04. last updated 11/19/2023
 * you can contact me on Discord @jovan04 (legacy - Jovan04#8647)
 * github: https://github.com/Jovan-04/
 * 
 * Minecraft Utility Bot
 */

const { goals: { GoalNear }} = require('mineflayer-pathfinder')
const { Vec3 } = require('vec3')
const bases = require('../destinations/bases.js')
const { readlineLog } = require('../utils')

module.exports = {
  usage: 'sleep <Base>',
  description: 'Navigate bot to the bed at the specified Base, and sleep in it',
  func: async (bot, args) => {
    if (!args[0]) return readlineLog(`\u001b[91m Incorrect arguments. Usage: ${module.exports.usage} \u001b[0m`)
    const base = bases[args[0]]
    if (!base) return readlineLog(`\u001b[91m No base ${args[0]} found \u001b[0m`)
  
    const { x, y, z } = base.bedLocation
  
    if (!(x && y && z)) return readlineLog('\u001b[91m No bed found \u001b[0m')
  
    // stand on top of the bed
    await bot.executeCommand(`goto coords ${x} ${y+1} ${z}`)
    
    await bot.sleep(bot.blockAt(new Vec3(x, y, z))).catch(err => readlineLog(err))
  }
}
