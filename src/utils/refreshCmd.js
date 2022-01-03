const { Config } = require('../config');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const fs = require('fs');
const TxtCreate = require('./txtCreate');
const GetFiles = require('./getFiles');

const rest = new REST({ version: '9' }).setToken(Config.BOT_TOKEN);

// Storing command and getting files with commands
const commands = [];
const commandsData = GetFiles('./src/commands/');

// Pushing all commands to array
for (const cmd of commandsData) {
    if (cmd.data) {
        commands.push(cmd.data.toJSON());
    } else {
        const path = cmd.slice(1, cmd.length)
        const rawFile = fs.readFileSync(`src/${path}`, 'utf8');
        const txtCmd = TxtCreate(rawFile, path);
        if (txtCmd.data) {
            commands.push(txtCmd.data.toJSON());
        }
    }
}

(async () => {
    try {
      console.log('[INFO]: Began refresh slash commands!');
      await rest.put(
        Routes.applicationGuildCommands(Config.CLIENT_ID, Config.GUILD_ID),
        { body: commands },
      );
      console.log(`[SUCCESS]: Loaded ${commands.length} commands!`);
    } catch (err) {
      console.log(`[ERROR]: Could not load commands! Check below for more info.\n` + err);
    }
})();