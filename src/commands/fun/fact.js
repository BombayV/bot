const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const { JOKE_AUTH } = require('../../config').Config;

// Fetching options
const options = {
    method: 'GET',
    headers: {
        "X-Api-Key": JOKE_AUTH,
        "Accept" : "application/json",
        "Content-Type" : "application/json",
        "User-Agent" : "https://github.com/BombayV/bot"
    }
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fact')
		.setDescription('Replies with a random fact.'),
	async execute(interaction) {
        // Fetch API
        const resp = await fetch('https://api.api-ninjas.com/v1/facts?limit=1', options);

        // Check if we got a response
        if (resp?.statusText !== 'OK') {
            return await interaction.reply('Could not fetch fact API.');
        }
        const jsonFact = await resp.json();
        await interaction.reply(`**${jsonFact[0].fact}**`);
	},
};