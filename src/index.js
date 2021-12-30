const Config = require('./config.js').Config;
const Statuses = require('./config.js').Statuses;
const GetFiles = require('./utils/getFiles.js');

const { Client, Intents, Collection } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.commands = new Collection();

const commands = GetFiles('./src/commands/', '.js');
for (const cmd of commands) {
    if (cmd.data) {
        client.commands.set(cmd.data.name, cmd);
    }
}

// const commandFiles = fs.readdirSync('./src/commands', {
//     withFileTypes: true
// });
// for (const file of commandFiles) {
//     if (file.isDirectory()) {

//     } else if (file.name.endsWith('.js')) {
//         const cmd = require(`./commands/${file.name}`);
//         if (cmd.data) {
//             client.commands.set(cmd.data.name, cmd);
//         }
//     }
// }

client.on('ready', _ => {
  const presence = client.user.setPresence({ activities: [{ name: Config.DESCRIPTION, type: Config.ACTIVITY }], status: Config.STATUS });
  if (!presence) return;
	if (!Statuses) return;
	console.log(
		`Bot Name: ${client.user.username}\nPresence: ${presence.activities[0].name}\nStatus: ${Statuses[presence.status]}\nCommand Files: ${commands.length}\nActivity: ${[presence.activities[0].type]}`
	)
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);
	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.log(`[ERROR/COMMAND]: ${error}`);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}

});

client.login(Config.BOT_TOKEN);