/*
 * created by Jovan04. last updated 09/30/2023
 * you can contact me on Discord @jovan04 (legacy - Jovan04#8647)
 * github: https://github.com/Jovan-04/
 * 
 * Minecraft Utility Bot
 */

const { goals: { GoalNear }} = require('mineflayer-pathfinder')
const { Vec3 } = require('vec3')
const homes = require('../destinations/homes.json')
const { readlineLog } = require('../utils')

module.exports = async (bot, args) => {
  if (!args[0]) return readlineLog("\u001b[91m Incorrect arguments. Usage: sleep <destination>\u001b[0m")
  if (!homes[args[0]]) return readlineLog(`No home ${args[0]} found`)

  const { x, y, z } = homes[args[0]]['bedLocation']

  if (!(x && y && z)) return readlineLog("No bed found")

  readlineLog(`\u001b[36m Bot now going to coordinates x=${x}, y=${y}, z=${z}\u001b[0m`)

  await bot.pathfinder.goto(new GoalNear(x, y, z, 2))

  readlineLog(`\u001b[36m Bot going to sleep at home ${args[0]}\u001b[0m`)

  await bot.sleep(bot.blockAt(new Vec3(x, y, z))).catch(err => readlineLog(err))
}