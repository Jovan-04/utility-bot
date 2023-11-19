/*
 * created by Jovan04. last updated 11/18/2023
 * you can contact me on Discord @jovan04 (legacy - Jovan04#8647)
 * github: https://github.com/Jovan-04/
 * 
 * Minecraft Utility Bot
 */

const readline = require('readline')
const { Vec3 } = require('vec3')


const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function readlineLog(message, debug) {
  const { debugMessages } = require('./config.json')
  // don't log if the debug config property is false, and this message is labeled as a debug message
  if ( !debugMessages && debug ) return

  readline.moveCursor(process.stdout, -2, 0) // we move the cursor to the left two places because our cursor is already two positions in (because of the input arrow)
  console.log(message)
  rl.prompt() // regenerate our little arrow on the input line
}

// sort points based on the y level, then into rows
// it's decent, but probably should be redone
function sortPointsByRow(crops) {
  let sortedCrops = crops.sort((a, b) => (a.z - b.z))
  sortedCrops = sortedCrops.sort((a, b) => (a.x - b.x))
  sortedCrops = sortedCrops.sort((a, b) => (a.y - b.y))

  let row = []
  let snakeCrops = []

  for (const c in sortedCrops) {
    if (sortedCrops[c].x !== sortedCrops[c-1]?.x) {
      if (sortedCrops[c].x % 2 === 0) {
        row.reverse()
      }
      snakeCrops = snakeCrops.concat(row)
      row = []
    }
    row.push(sortedCrops[c])
  }

  if (row.length !== 0) {
    if (row[0].x % 2 === 0) {
      row.reverse()
    }
    snakeCrops = snakeCrops.concat(row)
  }

  return snakeCrops
}

// greedy algorithm - always choose the nearest point
// also should be rewritten & optimized
function sortPointsByGreedy(points, startingPoint) {
  const path = []
  //construct path from given points
  let currentPos = startingPoint || new Vec3(0, 0, 0);
  let posCollected = [];

  for (let i = 0; i <= points.length; i++) {
    let dis = undefined;
    let nearestPoint;

    for (const j of points) {
      if (posCollected.includes(j)) continue;
      if (!dis || currentPos.distanceTo(j) < dis) {
        dis = currentPos.distanceTo(j);
        nearestPoint = j;
      }
    }

    if (nearestPoint) {
      posCollected.push(nearestPoint);
      path.push(nearestPoint);
      currentPos = nearestPoint;
      //remove element from points array so we have fewer things to search?  https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array
    }
  }

  return path //sequence of vec3s in the order that we'll be walking to them
}


class Queue { // to be used later for a command queue
  constructor() {
    this.items = {}
    this.frontIndex = 0
    this.backIndex = 0
  }
  enqueue(item) {
    this.items[this.backIndex] = item
    this.backIndex++
    return
  }
  dequeue() {
    const item = this.items[this.frontIndex]
    delete this.items[this.frontIndex]
    this.frontIndex++
    return item
  }
  peek() {
    return this.items[this.frontIndex]
  }
  get printQueue() {
    return this.items;
  }
}

module.exports = {
  sleep,
  readlineLog,
  sortPointsByRow,
  sortPointsByGreedy,
  Queue,
}