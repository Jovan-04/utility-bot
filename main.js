/*
 * created by Jovan04. last updated 09/29/2023
 * you can contact me on Discord @jovan04 (legacy - Jovan04#8647)
 * github: https://github.com/Jovan-04/
 * 
 * Minecraft Utility Bot
 */

// load mineflayer-related libraries
const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals: { GoalBlock, GoalNear, GoalGetToBlock } } = require('mineflayer-pathfinder')
const inventoryViewer = require('mineflayer-web-inventory')
const mineflayerViewer = require('prismarine-viewer').mineflayer

// load node.js libraries
const readline = require('readline')

// import everything from project files
const { username, auth, host, port, version, inventoryViewerPort, worldViewerPort, worldViewerFirstPerson } = require('./config.json')
const { sleep, readlineLog } = require('./utils.js')

// join the minecraft server
const bot = mineflayer.createBot({ username, auth, host, port, version })

// creates our readline interface with our console as input and output
global.rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

bot.once('spawn', () => {
  console.log(`Bot joined ${host}:${port} with username ${bot.username}.`)
  bot.loadPlugin(pathfinder)
  const movements = new Movements(bot)
  bot.pathfinder.setMovements(movements)

  // start the mineflayer-web-inventory and prismarine-viewer on the ports the user specified
  if (inventoryViewerPort) inventoryViewer(bot, { port: inventoryViewerPort })
  if (worldViewerPort) mineflayerViewer( bot, { firstPerson: worldViewerFirstPerson, port: worldViewerPort })

  // gives us a blue arrow at the bottom for the input line 
  rl.setPrompt('\u001b[94m> \u001b[0m'); setTimeout(() => { rl.prompt() }, 500)
})

bot.on('message', (message) => {
  // log all messages the bot receives to the console
  // we convert our message to ansi to preserve chat formatting
  readlineLog(message.toAnsi())
})

bot.on('kicked', readlineLog)
bot.on('error', readlineLog)


rl.on('line', (line) => {
  readline.moveCursor(process.stdout, 0, -1) // move cursor up one line
  readline.clearScreenDown(process.stdout) // clear all the lines below the cursor (i.e. the last line we entered)
  executeCommand(line.toString()) // sends the line we entered to ingame chat
})


function executeCommand(commandLine) {
  // parse the line we read into a command and args
  const [command, ...args] = commandLine.split(' ')
  let commandModule

  try { // attempt to load the command from a file
    commandModule = require(`./commands/${command}`)
  } 
  catch (error) { // we failed to load the command, send a color-coded message to the console
    readlineLog(`\u001b[91m Command \u001b[36m${command}\u001b[91m not recognized \u001b[0m`)
    return
  }

  commandModule(bot, args)
}
