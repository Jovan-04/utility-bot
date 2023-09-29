# Minecraft Utility Bot
### by Jovan04
Small modular utility bot that I made in my free time. Includes commands from my old farming bot (now private). For any questions, feel free to shoot me a DM on Discord `@Jovan04`.

## Usage
1. download/clone the repository
2. edit the `config.json` file to include your account username or email address, authentication mode (`"offline"` or `"microsoft"`), and server info to connect to
3. run the script from any terminal; your bot will automatically join the game (you may have to authenticate through a web browser)
4. to control the bot, use the readline interface of your terminal; chat-based controlling coming soon (with regex!)

## Adding a new command
0. experience with the [mineflayer](https://github.com/PrismarineJS/mineflayer) library is required.
1. create a copy of the `command-template.js` file and rename it to whatever you want the name of your command to be.
2. fill in the function body with whatever you want the bot to do. the pathfinder plugin is already loaded for the bot. other mineflayer plugins will need to be added in the `main.js` file.