const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { COLOR } = require('../../config').Config;
const HasPerms = require('../../utils/permissions');

const CurSticky = {}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sticky')
		.setDescription('Create sticky message on current channel')
        .addBooleanOption(option =>
            option.setName('status')
                .setDescription('Add/remove current sticky.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Sticky message that will appear.')
                .setRequired(false)
        ),
	async execute(interaction) {
        // Check for perms
        if (!HasPerms(interaction.member._roles)) return await interaction.reply({ content: 'You do not have permissions for this command!', ephemeral: true });

        // Defer reply so that there's time to create sticky.
        await interaction.deferReply({ ephemeral: true });

        // Check for member input
        const { _, options } = interaction;
        const status = options.getMember('status');
        const curChannel = interaction.channel;
        if (!status) {
            if (!CurSticky[curChannel.id]?.status === true) return await interaction.editReply({ content: `No current sticky in this channel!`})

            return await interaction.editReply({ content: `Removed sticky` });
        }

        try {
            const message = options.getString('message');
            if (!message) return await interaction.editReply({ content: `Cannot set sticky with empty message.`})

            // Sticky embed
            const stickyEmbed = new MessageEmbed()
            .setColor(COLOR)
            .setDescription(message)
            .setTimestamp();

            CurSticky[curChannel.id] = {
                status: true,
                message: message
            }

            const newSticky = await channel.send({ embeds: [stickyEmbed]});
            CurSticky[curChannel.id] = {
                status: true,
                message: message,
                id: newSticky.id
            }

            return await interaction.editReply({ content: 'Sticky created!' })
        } catch (err) {
            console.log(err)
            return await interaction.editReply({ content: `Could not create sticky!` })
        }
	}
};