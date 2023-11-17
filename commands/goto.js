/*
 * created by Jovan04. last updated 11/16/2023
 * you can contact me on Discord @jovan04 (legacy - Jovan04#8647)
 * github: https://github.com/Jovan-04/
 * 
 * Minecraft Utility Bot
 */

const { goals: { GoalBlock }} = require('mineflayer-pathfinder')
const { readlineLog } = require('../utils')

module.exports = {
  usage: 'goto coords <x> <y> <z> OR goto player <username> OR goto dest <Destination>',
  description: 'Navigate the bot to the specified location',
  func: async (bot, args) => {
    if (!args[0]) return readlineLog(`\u001b[91m Incorrect arguments. Usage: ${module.exports.usage} \u001b[0m`)
    let x, y, z
    
    switch (args[0].toLowerCase()) {
      case 'coords':
        [, x, y, z] = args.map(Number)
        break
      
      case 'player':
        const player = bot.players[args[1]]
        if (!player) return readlineLog(`\u001b[91m Player ${args[1]} not found\u001b[0m`)
    
        if (!player.entity?.position) return readlineLog(`\u001b[91m I can't see player ${args[1]}. Are they too far away? \u001b[0m`)
    
        ;({x, y, z} = player.entity.position)
      break
  
      case 'dest': // TODO: scan all .js files in destinations directory for places to go (what about Spain?)
        const bases = require('../destinations/bases.js')
        if (!bases[args[1]]) return readlineLog(`\u001b[91m Could not find home ${args[1]} \u001b[0m`)
        ;({x, y, z} = homes[args[1]].position)
        break
   
      default:
        return readlineLog(`\u001b[91m ${args[0]} is not a valid argument for 'goto'. Please use one of ['coords', 'player', 'home'] \u001b[0m`)
    }
  
    readlineLog(`\u001b[36m Bot now going to coordinates x=${x}, y=${y}, z=${z}\u001b[0m`)
  
    await bot.pathfinder.goto(new GoalBlock(x, y, z)).catch(err => readlineLog(err))
  
    readlineLog(`\u001b[36m Bot arrived at coordinates x=${x}, y=${y}, z=${z}\u001b[0m`)
  }
}
