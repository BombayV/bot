const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');

const options = {
    method: 'GET',
    headers: {
        "Accept" : "application/json",
        "Content-Type" : "application/json",
        "User-Agent" : "https://github.com/BombayV/bot"
    }
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('joke')
		.setDescription('Replies with a random joke.'),
	async execute(interaction) {

        const resp = await fetch('https://icanhazdadjoke.com/', options);
        if (resp.ok) {
            const jsonJoke = await resp.json()
            await interaction.reply(`**${jsonJoke.joke}**`)
        }
	},
};