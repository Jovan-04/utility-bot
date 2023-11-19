/*
 * created by Jovan04. last updated 11/18/2023
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
  ['Cocoa']: new Farm('Cocoa', new Vec3(150, 95, -193), 'cocoa', 'square', [3], 'Jovans_Base'),
}
