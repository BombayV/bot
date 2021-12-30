const Config = require('../config.js').Config;
const GetFiles = require('../utils/getFiles.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const rest = new REST({ version: '9' }).setToken(Config.BOT_TOKEN);

const commands = [];
const commandsData = GetFiles('./src/commands/', '.js');

for (const cmd of commandsData) {
    if (cmd.data) {
        commands.push(cmd.data.toJSON());
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
      console.log(`[ERROR]: Could not load commands! Check below for more info\n` + err);
    }
})();