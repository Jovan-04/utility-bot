/*
 * created by Jovan04. last updated 09/29/2023
 * you can contact me on Discord @jovan04 (legacy - Jovan04#8647)
 * github: https://github.com/Jovan-04/
 * 
 * Minecraft Utility Bot
 */

const readline = require('readline')


const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function readlineLog(message) {
  readline.moveCursor(process.stdout, -2, 0) // we move the cursor to the left two places because our cursor is already two positions in (because of the input arrow)
  console.log(message)
  rl.prompt() // regenerate our little arrow on the input line
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
  Queue,
}