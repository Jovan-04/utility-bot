/*
 * created by Jovan04. last updated 11/19/2023
 * you can contact me on Discord @jovan04 (legacy - Jovan04#8647)
 * github: https://github.com/Jovan-04/
 * 
 * Minecraft Utility Bot
 */

const { Vec3 } = require('vec3')
// const bases = require('./destinations/bases.js')

class Destination {
  position // the position of the Destination

  constructor(position) {
    // input validation
    if (!position instanceof Vec3) throw new Error(`type of \`position\` must be a Vec3 object`)

    this.position = position
  }
}

// represent a location in the world the bot can harvest crops from
class Farm extends Destination {
  // constants for reference to what crops and shapes of farms are supported
  // cactus is also supported... except for the fact that cactus are prickly
  static SUPPORTED_CROPS = ['carrots', 'potatoes', 'wheat', 'beetroots', 'cocoa', 'sugar_cane', 'pumpkin', 'melon']
  static SUPPORTED_SHAPES = ['square', 'rectangle', 'circle']
  static MEASUREMENT_NUMS = {
    square: 1,
    rectangle: 2,
    circle: 1,
  }
  static VERT_DIST = 4 // blocks must be within 4 vertical blocks to be considered within the farm

  name // name of the Farm 
  position // location of the center block
  crop  // string representing the block to harvest - one of `SUPPORTED_CROPS`
  shape // string representing the shape of the farm - one of `SUPPORTED_SHAPES`
  measurements = [] // side lengths of a square, diameter of a circle, etc.
  base

  // advanced constructor for custom shapes
  constructor(name, position, crop, shape, measurements, baseToDeposit) {
    // call the super constructor... why does JS require this??
    super(position)
    // input validation
    if (typeof name !== 'string') throw new Error(`type of \`name\` must be 'string', got ${typeof name}`)
    if (!position instanceof Vec3) throw new Error(`type of \`position\` must be a Vec3 object`)
    if (!Farm.SUPPORTED_CROPS.includes(crop)) throw new Error(`${crop} is not in the list of supported crops`)
    if (!Farm.SUPPORTED_SHAPES.includes(shape)) throw new Error(`${shape} is not in the list of supported shapes`)

    if (measurements.length !== Farm.MEASUREMENT_NUMS[shape]) throw new Error(`\`measurements\` has ${measurements.length} entries, but should have ${Farm.MEASUREMENT_NUMS[shape]}`)
    measurements.forEach(e => {
      if (typeof e !== 'number') throw new Error('`measurements` should be an array of Numbers')
    })

    if (baseToDeposit !== undefined && typeof baseToDeposit !== 'string') throw new Error(`type of \`name\` must be 'string' or 'undefined', got ${typeof baseToDeposit}`)
    // if (!bases[baseToDeposit]) throw new Error(`Base ${baseToDeposit} not recognized`) // can't check the Base because it makes a circular dependency

    // assign values
    this.name = name
    this.position = position
    this.crop = crop
    this.shape = shape
    this.measurements = measurements
    this.base = baseToDeposit
  }

  // check if a point is inside our farm
  isInFarm(point) {
    if (!point instanceof Vec3) throw new Error(`type of \`point\` must be a Vec3 object, got ${typeof point}`)
    if (!point) return false
    const { x: tx, y: ty, z: tz } = this.position
    const { x: ox, y: oy, z: oz } = point

    // return false if the point is more than 4 blocks above or below the center block
    if (Math.abs(ty - oy) > Farm.VERT_DIST) return false

    if (this.shape === 'square') {
      if ( (Math.abs(tx - ox) < this.measurements[0]) && (Math.abs(tz - oz) < this.measurements[0]) ) return true
    }

    if (this.shape === 'rectangle') {
      if ( (Math.abs(tx - ox) < this.measurements[0]) && (Math.abs(tz - oz) < this.measurements[1]) ) return true
    }

    if (this.shape === 'circle') {
      if ( this.position.distanceTo(point) < this.measurements[0] ) return true
    }

    return false
  }
}

// represents a Base with a position in the world, a chest, and a bed
class Base extends Destination {
  // we only need a constructor - we want to guarantee that we have all these things
  constructor(name, position, bedLocation, chestLocation) {
    // call the super constructor... why does JS require this??
    super(position)
    // input validation
    if (typeof name !== 'string') throw new Error(`type of \`name\` must be 'string', got ${typeof name}`)
    if (!position instanceof Vec3) throw new Error(`type of \`position\` must be a Vec3 object`)
    if (!bedLocation instanceof Vec3) throw new Error(`type of \`bedLocation\` must be a Vec3 object`)
    if (!chestLocation instanceof Vec3) throw new Error(`type of \`chestLocation\` must be a Vec3 object`)

    // assign values
    this.name = name
    this.position = position
    this.bedLocation = bedLocation
    this.chestLocation = chestLocation
  }
}

// export the classes
module.exports = {
  Farm,
  Base,
}