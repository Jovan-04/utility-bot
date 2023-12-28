/*
 * created by Jovan04. last updated 11/18/2023
 * you can contact me on Discord @jovan04 (legacy - Jovan04#8647)
 * github: https://github.com/Jovan-04/
 * 
 * Minecraft Utility Bot
 */

const { readlineLog, sortPointsByGreedy, sortPointsByRow } = require('../utils.js')
const farms = require('../destinations/farms.js')
const bases = require('../destinations/bases.js')
const { Farm } = require('../destinations.js')
const { Vec3 } = require('vec3')
const { GoalNear } = require('mineflayer-pathfinder').goals

const CROP_REPLANT = {
  carrots: 'carrot',
  potatoes: 'potato',
  wheat: 'wheat_seeds',
  beetroots: 'beetroot_seeds',
  pumpkin: null,
  melon: null,
  cocoa: 'cocoa_beans',
  sugar_cane: null,
  cactus: null,
}

const DIRECTION_OFFSET = {
  north: new Vec3(0, 0, -1),
  south: new Vec3(0, 0, 1),
  east: new Vec3(1, 0, 0),
  west: new Vec3(-1, 0, 0),
  up: new Vec3(0, 1, 0),
  down: new Vec3(0, -1, 0),
}

module.exports = {
  usage: 'harvest farm <Farm> OR harvest crop <crop> [-p <x> <y> <z>] [-s <size>]',
  description: 'harvest all mature crops at a specific Farm, or out in the world',
  func: async (bot, args) => {
    if (!args[0]) return readlineLog(`\u001b[91m Incorrect arguments. Usage: ${module.exports.usage} \u001b[0m`)

    let farm

    switch (args[0].toLowerCase()) {
      case 'farm': // harvests a Farm, and deposits it at its specified Base (or nearest if unspecified)
        farm = farms[args[1]]
        if (!farm) return readlineLog(`\u001b[91m The Farm ${args[1]} does not exist. \u001b[0m`)
        break

      case 'crop': // finds crops of specific type within specified radius and harvests them, depositing at the nearest Base
        // parse the relevant args from the command
        let [position, crop, shape, measurements] = parseArgsFromCommand(args.slice(1))

        // validate & process the parsed data we got
        if (position === undefined) position = bot.entity.position.floored()
        if (!position) return readlineLog(`\u001b[91m The position could not be recognized \u001b[0m`)

        if (!Farm.SUPPORTED_CROPS.includes(crop)) return readlineLog(`\u001b[91m ${crop} is not a supported crop. Please use one of [${Farm.SUPPORTED_CROPS}] \u001b[0m`)

        // we know shape is valid - it's always 'circle'
        // we know measurements is valid - input sanitization is done in the parsing function

        farm = new Farm('temp', position, crop, shape, measurements)
        break
  
      default:
        return readlineLog(`\u001b[91m ${args[0]} is not a valid argument for 'harvest'. Please use one of ['farm', 'crop'] \u001b[0m`)
    }

    readlineLog(farm) 
    // itemToReplant based on the crop
    itemToReplant = CROP_REPLANT[farm.crop]

    // ideally should navigate to within render distance of the farm before scanning for blocks
    // cropsToFarm based on the crop, shape, position, and measurements of the Farm
    cropsToFarm = bot.findBlocks({
      maxDistance: 30, //Math.max(...farm.measurements),
      point: farm.position,
      matching: bot.registry.blocksByName[farm.crop].id,
      useExtraInfo: (b) => (farm.isInFarm(b.position)),
      count: 9999,
      // count: farm.measurements[0] * (farm.measurements[1] || farm.measurements[0]),
    })

    // filter cactus and sugar cane so that we only break the second block on each plant, no matter the height
    if (['cactus', 'sugar_cane'].includes(farm.crop)) cropsToFarm = cropsToFarm.filter(pos => {
      // block below this block is not part of the plant - we don't want to break this block (because then the plant won't grow back)
      if (bot.blockAt(pos.offset(0, -1, 0)).name !== farm.crop) return false
      // block two below this block is not part of the plant - we break it (because they means we have the second block up from the ground)
      if (bot.blockAt(pos.offset(0, -2, 0)).name !== farm.crop) return true
      // default to not breaking it
      return false
    })

    const sortedCrops = sortPointsByRow(cropsToFarm)
    readlineLog("harvesting crops:" + sortedCrops.length)

    const cropsToReplant = []

    // farm crops
    for (const point of sortedCrops) {
      const block = bot.blockAt(point)
      await digBlock(block)
      await replantBlock(block)
      // check for maintainence
    }

    // replant crops missed at the beginning
    for (const block of cropsToReplant) {
      await replantBlock(block)
    }

    // collect lingering crops on the ground
    const { x, y, z } = farm.position
    await bot.executeCommand(`collectitems -p ${x} ${y} ${z} -r ${2 + Math.max(...farm.measurements) * 1.5}`)

    // deposit crops at base
    let base
    let d = Infinity

    if (farm.base) { // we specified a Base, try to find it
      if (!bases[farm.base]) return readlineLog(`\u001b[91m Could not find Base ${farm.base} from farm ${farm.name} \u001b[0m`)
      base = bases[farm.base].name
    } else { // find the closest Base to current position
      const p = bot.entity.position
      for (const [n, b] of Object.entries(bases)) {
        if (p.distanceTo(b.chestLocation) < d) base = n
      }
    }

    await bot.executeCommand(`deposit ${base}`)

    // helper functions
    // dig a given block
    async function digBlock(block) {
      const { x, y, z } = block.position
      // go to the crop
      await bot.pathfinder.goto(new GoalNear(x, y, z, 2))
      // equip a tool with fortune
      
      // break the crop
      await bot.dig(block).catch()
    }

    // replant the block that was
    async function replantBlock(block) {
      let blockOffset, func, itemToReplant
      switch (block.name) {
        case 'wheat':
        case 'carrots':
        case 'potatoes':
        case 'beetroots':
          // get item we need to replant with
          itemToReplant = CROP_REPLANT[block.name]

          // replant should be on the block below
          blockOffset = DIRECTION_OFFSET['down']
          
          func = async (pos) => {
            // activate the block the crop was on
            await bot.activateBlock(bot.blockAt(pos))
          }
        break      

        case 'pumpkin':
        case 'melon':
        case 'cactus':
        case 'sugar_cane':
          // no replant, so return early
          return

        case 'cocoa':
          // get item we need to replant with
          itemToReplant = CROP_REPLANT[block.name]

          // replant depends on where the cocoa was facing before
          const direction = block.getProperties()['facing']
          blockOffset = DIRECTION_OFFSET[direction]

          func = async (pos) => {
            // place the cocoa bean block in the opposite direction we offset (so that the bean ends up in the same spot)
            await bot.placeBlock(bot.blockAt(pos), blockOffset.scaled(-1)).catch()
          }
        break
      }

      // find an item matching the item we should replant with
      const item = bot.inventory.items().find(i => (i.name === itemToReplant))
      // if there's nothing to replant with, come back to it later
      if (!item) return cropsToReplant.push(block)

      // equip the crop we'll replant
      await bot.equip(item).catch()

      // walk to the block
      const { x, y, z} = block.position
      await bot.pathfinder.goto(new GoalNear(x, y, z, 2))

      // look at an offset based on where to replant
      const pos = block.position.add(blockOffset)
      await bot.lookAt(pos)
      // func() is either activateBlock or placeBlock, depending on the crop
      await func(pos)
    }
    
  }
}

function parseArgsFromCommand(command) {
  let position, crop, shape, measurements

  // position to search from
  pIndex = command.indexOf('-p')
  if (pIndex >= 0) { // we found the -p flag
    position = null // if the flag parsing fails, we want position to be null - not undefined

    if (pIndex + 4 <= command.length) { // make sure there are enough args after the flag
      // get next three elements after the -p flag, and convert them to Numbers
      [x, y, z] = command.slice(pIndex + 1, pIndex + 4).map(Number)

      // if there are no NaNs, make a Vec3
      if (![x, y, z].some(isNaN)) position = new Vec3(x, y, z)
    }
  }

  // crop to farm - always the first arg, required
  crop = command[0]
  

  // default to a circle shape
  shape = 'circle'

  // set the size of the circle (diameter)
  sIndex = command.indexOf('-s')
  if (sIndex >= 0 && sIndex + 2 <= command.length) { // we found the -s flag
    // take the absolute value of input number (negative sizes aren't cool)
    const diameter = Math.abs(Number( command[sIndex+1] ))
    // if it's NaN, default to 32 - i'm not super happy with this solution; it may be better to return null and throw a warning outside the function
    measurements = [ isNaN(diameter) ? 32 : diameter ]
  } else {
    measurements = [32]
  }

  return [position, crop, shape, measurements]
}
