const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { COLOR } = require('../../config').Config;
const { FormatMs, FormatByte } = require('../../utils/variedUtils');

const sysinfo = require('systeminformation');
const packJson = require('../../../package.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Replies with basic information about the server/bot.'),
	async execute(interaction) {
        // Major use of pe-bot
        const mem = await sysinfo.mem();
        const statusEmbed = new MessageEmbed()
            .setColor(COLOR)
            .setTitle('Server Info & Status')
            .setDescription('Server & Bot Data *(numbers may not represent accurate results)*.')
            .setThumbnail(interaction.user.displayAvatarURL())
            .setFields([
                { name: 'Users number', value: '```\n' + interaction.member.guild.memberCount.toString() + '\n```', inline: true },
                { name: 'Bot Number', value: '```\n' + interaction.member.guild.members.cache.filter(member => member.user.bot).size  + '\n```', inline: true },
                { name: 'Emojis Number', value: '```\n' + interaction.guild.emojis.cache.size  + '\n```', inline: true },
                { name: 'Uptime', value: '```\n' + interaction.client.uptime.FormatMs() + '\n```', inline: true },
                { name: 'WS Latency', value: '```\n' + interaction.client.ws.ping.toString() + 'ms\n```', inline: true },
                { name: 'Memory', value: '```\n' + `${mem.used.FormatByte()}/${mem.total.FormatByte()}GB` + '\n```', inline: true },
                { name: 'Heap Used', value: '```\n' + `${process.memoryUsage().heapUsed.FormatByte()}GB` + '\n```', inline: true },
                { name: 'Heap Max', value: '```\n' + `${process.memoryUsage().heapTotal.FormatByte()}GB` + '\n```', inline: true },
                { name: 'Discord.js Version', value: '```\n' + packJson.dependencies['discord.js'] + '\n```', inline: true },
            ])
            .setTimestamp()

        await interaction.reply({embeds: [statusEmbed]});
	},
};