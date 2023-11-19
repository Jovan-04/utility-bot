/*
 * created by Jovan04. last updated 11/18/2023
 * you can contact me on Discord @jovan04 (legacy - Jovan04#8647)
 * github: https://github.com/Jovan-04/
 * 
 * Minecraft Utility Bot
 */

const { readlineLog, sortPointsByGreedy } = require("../utils")
const { Vec3 } = require('vec3')
const { GoalNear } = require('mineflayer-pathfinder').goals

module.exports = { 
  usage: 'collect [-r <range: 32>] [-p <x> <y> <z>]',
  description: 'Collect items within an (optional) specified range of an (optional) specified point',
  func: async (bot, args) => {
    let range = 32
    let point = bot.entity.position

    // parse flags
    pIndex = args.indexOf('-p')
    if (pIndex >= 0) { // we found the -p flag
      // make sure there are three elements after the -p flag
      if (pIndex + 4 > args.length) return readlineLog("\u001b[91m The position could not be recognized \n Please ensure there are 3 space-separated numbers after the -p flag \u001b[0m")

      // get next three elements after the -p flag, and convert them to Numbers
      const [x, y, z] = args.slice(pIndex + 1, pIndex + 4).map(Number)

      // if any coordinate is NaN, return a warning
      if ([x, y, z].some(isNaN)) return readlineLog("\u001b[91m The position could not be recognized \n Please ensure that all arguments after the flag are numbers \u001b[0m")

      // all our coordinates are valid, assign them to a new Vec3
      point = new Vec3(x, y, z)
    }

    rIndex = args.indexOf('-r')
    if (rIndex >= 0) { // we found the -r flag
      // make sure there is an element after the -r flag
      if (rIndex + 2 > args.length) return readlineLog("\u001b[91m The range could not be recognized \n Please ensure there is a space-separated number after the -r flag \u001b[0m")
      
      // get next element and convert it to a Number
      range = Math.abs(Number( args[rIndex+1] ))

      if (isNaN(range)) return readlineLog("\u001b[91m The range could not be recognized \n Please ensure there is a space-separated number after the -r flag \u001b[0m")
    }

    const worldItems = Object.values(bot.entities).filter(ent => ent.name === 'item' && point.distanceTo(ent.position) <= range)

    for (const point of sortPointsByGreedy(worldItems.map(i => i.position))) {
      await bot.pathfinder.goto(new GoalNear(...point.toArray(), 1))
      await bot.waitForTicks(10)
    }

  }
}
