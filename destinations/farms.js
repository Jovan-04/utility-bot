/*
 * created by Jovan04. last updated 11/19/2023
 * you can contact me on Discord @jovan04 (legacy - Jovan04#8647)
 * github: https://github.com/Jovan-04/
 * 
 * Minecraft Utility Bot
 */

const { Farm } = require('../destinations')
const { Vec3 } = require('vec3')

module.exports = { // sample farms I set up in a creative world
  ['Carrots']: new Farm('Carrots', new Vec3(158, 95, -182), 'carrots', 'rectangle', [8, 5], 'Jovans_Base'),
  ['Potatoes']: new Farm('Potatoes', new Vec3(158, 95, -205), 'potatoes', 'circle', [9], 'Jovans_Base'),
  ['Wheat']: new Farm('Wheat', new Vec3(175, 95, -192), 'wheat', 'square', [5], 'Jovans_Base'),
  ['Beetroots']: new Farm('Beetroots', new Vec3(177, 95, -212), 'beetroots', 'rectangle', [5, 9], 'Jovans_Base'),
  ['Cocoa']: new Farm('Cocoa', new Vec3(159, 94, -225), 'cocoa', 'rectangle', [9, 6], 'Jovans_Base'),
  // ['Cactus']: new Farm('Cactus', new Vec3(175, 94, -179), 'cactus', 'square', [4], 'Jovans_Base'),
  ['Cane']: new Farm('Cane', new Vec3(140, 94, -198), 'sugar_cane', 'rectangle', [5, 7], 'Jovans_Base'),
  ['Pumpkin']: new Farm('Pumpkin', new Vec3(140, 95, -215), 'pumpkin', 'square', [5], 'Jovans_Base'),
  ['Melon']: new Farm('Melon', new Vec3(140, 95, -225), 'melon', 'square', [5], 'Jovans_Base'),
}
