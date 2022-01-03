const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');

// Fetching options
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
		.setName('fact')
		.setDescription('Replies with a random Fact (jokeAPI rn).'),
	async execute(interaction) {
        // Fetch API
        const resp = await fetch('https://icanhazdadjoke.com/', options);

        // Check if we got a response
        if (!resp.ok) {
            return await interaction.reply('Could not fetch Fact API.')
        }
        const jsonJoke = await resp.json()
        await interaction.reply(`**${jsonJoke.joke}**`)
	},
};