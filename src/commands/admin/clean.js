const { SlashCommandBuilder } = require('@discordjs/builders');
const { Capitilize } = require('../../utils/variedUtils');
const fs = require('fs');
const HasPerms = require('../../utils/permissions');
const TxtCreate = require('../../utils/txtCreate');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('name')
		.setDescription('Create a new command.')
        .addNumberOption(option =>
            option.setName('id')
                .setDescription('Message id to delete messages till.')
                .setRequired(false)
        )
        .addUserOption(option =>
            option.setName('member')
                .setDescription('Member in the guild.')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('messages')
                .setDescription('Number of messages')
                .setRequired(false)
        ),
	async execute(interaction) {
        // Check for perms
        if (!HasPerms(interaction.member._roles)) return await interaction.reply({ content: 'You do not have permissions for this command!', ephemeral: true });

        // Defer reply so that there's time to delete messages.
        await interaction.deferReply( { ephemeral: true } );

        const allMessages = interaction.channel;


        await interaction.editReply({ content: `Command created!` });
	}
};