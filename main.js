/*
 * created by Jovan04. last updated 11/18/2023
 * you can contact me on Discord @jovan04 (legacy - Jovan04#8647)
 * github: https://github.com/Jovan-04/
 * 
 * Minecraft Utility Bot
 */

// load mineflayer-related libraries
const mineflayer = require('mineflayer')
const { pathfinder, Movements } = require('mineflayer-pathfinder')
const inventoryViewer = require('mineflayer-web-inventory')
const mineflayerViewer = require('prismarine-viewer').mineflayer

// load node.js libraries
const readline = require('readline')

// import everything from project files
const { username, auth, host, port, version, inventoryViewerPort, worldViewerPort, worldViewerFirstPerson, controlMessagesFromChat, acceptedControllers, commandRegex } = require('./config.json')
const { sleep, readlineLog, Queue } = require('./utils.js')

// join the minecraft server
const bot = mineflayer.createBot({ username, auth, host, port, version, defaultChatPatterns: false })
bot.commandQueue = new Queue() // to be used later for a command queue
bot.status = ''
bot.isBusy = false

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

  // if config.json says we should allow commands through chat, add a listener with the custom regex
  if (controlMessagesFromChat) bot.addChatPattern('command', new RegExp(commandRegex), { parse: true })

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

bot.on('chat:command', ([[username, command]]) => {
  // only allow approved people to control the bot
  if (!acceptedControllers.includes(username)) return

  executeCommand(command) // execute the line we just entered
})

// log bot error and kick messages
bot.on('kicked', readlineLog)
bot.on('error', readlineLog)

// handle readline inputs
rl.on('line', (line) => {
  readline.moveCursor(process.stdout, 0, -1) // move cursor up one line
  readline.clearScreenDown(process.stdout) // clear all the lines below the cursor (i.e. the last line we entered)
  executeCommand(line.toString()) // execute the line we just entered
})

function executeCommand(commandLine) {
  // parse the line we read into a command and args
  const [command, ...args] = commandLine.split(' ')
  let commandModule

  try { // attempt to load the command from a file
    commandModule = require(`./commands/${command}`)
  } 
  catch (error) { // we failed to load the command, send a color-coded message to the console
    if (error.code === 'MODULE_NOT_FOUND') {
      readlineLog(`\u001b[91m Command \u001b[36m${command}\u001b[91m not recognized \u001b[0m`)
      return
    } else {
      readlineLog(error)
      return
    }
  }

  const cmd = commandModule.func(bot, args)

  // returning the promise so that running a command can be awaited
  return cmd
}

// allow us to execute commands within other commands (recursive commands when?)
bot.executeCommand = executeCommand