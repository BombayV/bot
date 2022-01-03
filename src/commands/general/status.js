const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { COLOR } = require('../../config').Config;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Replies with basic information about the server/bot.'),
	async execute(interaction) {
        const statusEmbed = new MessageEmbed()
            .setColor(COLOR)
            .setTitle('Server Info & Status')
            .setThumbnail(interaction.user.displayAvatarURL())
            .setFields([
                { name: 'Guild Members', value: '0', inline: true },
                { name: 'Uptime', value: `Uptime`, inline: true },
                { name: 'WS Latency', value: '0', inline: true },
                { name: 'Memory', value: '0', inline: true },
                { name: 'Guild Members', value: '0', inline: true },
                { name: 'Discord.js Version', value: '0', inline: true },
            ])
            .setTimestamp()

        await interaction.reply({embeds: [statusEmbed]});
	},
};