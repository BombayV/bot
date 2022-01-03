const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { COLOR } = require('../config').Config;

const CreateCommand = (textData, path) => {
    if (!textData) return false;

    const data = {
        name: undefined,
        title: 'No title',
        description: 'No description',
        message: [],
        url: 'No url'
    }

    data.name = path?.toString()?.slice(path?.lastIndexOf('/') + 1, path?.length)?.split('.txt')[0].trim()
    if (!data.name || /^\s*$/.test(data.name)) return false;

    // txchungus goes brrr
    textData.split('\n').forEach(line => {
        if (line.startsWith('#title')) {
            data.title = line.substring('#title '.length).trim();
        } else if (line.startsWith('#description')) {
            data.description = line.substring('#description '.length).trim();
        } else if (line.startsWith('#url')) {
            data.url = line.substring('#url '.length).trim();
        } else {
            const splitLine = line.split('\\n');
            if (splitLine.length > 0) {
                for (const smallLine of splitLine) {
                    data.message.push(smallLine + '\n');
                }
            } else {
                data.message.push(line);
            }
        }
    });

    const cmd = {
        data: new SlashCommandBuilder()
        .setName(data.name)
        .setDescription(data.description)
        .addUserOption(option =>
            option.setName('member')
                .setDescription('Member in the guild.')
                .setRequired(false)
        ),
        async execute(interaction) {
            const { _, options } = interaction;

            const user = options.getUser('member') || interaction.user;

            if (!user) return await interaction.reply("Error sending message");
            const createdEmbed = new MessageEmbed()
                .setColor(COLOR)
                .setTitle(data.title)
                .setDescription(data.description)
                .setThumbnail(
                    user.displayAvatarURL({
                        format: 'png',
                        dynamic: true,
                        size: 96
                    })
                )
                .addFields(
                    { name: 'Help Message', value: "```\n" + data.message.join('\n') +  "```", inline: false },
                    { name: 'Help URL', value: "```\n" + data.url +  "```", inline: false },
                    { name: 'Help Requested', value: "```\n" + `@${user.username}` +  "```", inline: false }
                )
                .setTimestamp();

            await interaction.reply({ content: `<@${user.id}>`, embeds: [createdEmbed]});
        }
    }
    return cmd;
}

module.exports = CreateCommand;