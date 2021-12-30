const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('joke')
		.setDescription('Replies with a random joke.'),
	async execute(interaction) {
        fetch('https://icanhazdadjoke.com/')
        .then((resp) => resp.json())
        .then((data) => interaction.reply(`${data.setup}\n${data.delivery}`))
        .catch((e) => console.log(`[ERROR/JOKE]: Could not load joke. Read below\n` + e))
	},
};