const { SlashCommandBuilder } = require('@discordjs/builders');
const BallResponse = require('../../config').Responses;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('8ball')
		.setDescription('Random response to question.')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('What you are asking.')
                .setRequired(true)
        ),
	async execute(interaction) {
        const { _, options } = interaction;
        const question = options.getString('question', true);
		await interaction.reply(`> **${interaction.user.username}:** *${question}*\n**A:** *${BallResponse[Math.floor(Math.random() * BallResponse.length)]}*`);
	},
};