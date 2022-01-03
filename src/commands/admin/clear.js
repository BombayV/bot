const { SlashCommandBuilder } = require('@discordjs/builders');
const { Capitilize } = require('../../utils/variedUtils');
const fs = require('fs');
const HasPerms = require('../../utils/permissions');
const TxtCreate = require('../../utils/txtCreate');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Clear messages based on parameters.')
        .addStringOption(option =>
            option.setName('id')
                .setDescription('Message id to delete messages till.')
                .setRequired(false)
        )
        .addUserOption(option =>
            option.setName('member')
                .setDescription('Member in the guild.')
                .setRequired(false)
        )
        .addIntegerOption(option =>
            option.setName('count')
                .setDescription('Number of messages')
                .setRequired(false)
        ),
	async execute(interaction) {
        // Check for perms
        if (!HasPerms(interaction.member._roles)) return await interaction.reply({ content: 'You do not have permissions for this command!', ephemeral: true });

        // Defer reply so that there's time to delete messages.
        await interaction.deferReply( { ephemeral: true } );

        const { _, options } = interaction;

        const allMessages = interaction.channel.messages.fetch();
        const id = options.getString('id');
        const member = options.getMember('member');
        const count = options.getInteger('count');

        if (!id && !member && !count) return await interaction.editReply('Missing parameters "id" or "member" or "count"')

        const filtered = [];
        let i = 0;
        if (id) {
            const sortArray = (await allMessages).sort(function (a, b) {
                return a.createdTimestamp > b.createdTimestamp
            })

            let found = false;
            for (const msg of sortArray) {
                i++;
                filtered.push(msg[0])
                if (msg[0] == id) {
                    found = true;
                    break;
                };
            }
            if (!found) return await interaction.editReply('Could not find message with that id.')
        }

        if (!id && member || !id && count)
        (await allMessages).filter((msg) => {
            if (count <= i) return;
            console.log(member.id, msg.author.id)
            if (member && member.id == msg.author.id) {
                i++;
                filtered.push(msg);
            } else if (!member) {
                i++;
                filtered.push(msg);
            }
        })

        const deleted = await interaction.channel.bulkDelete(filtered, true).catch(console.log);
        if (!deleted) return await interaction.editReply('Error deleting messages.')
        const who = (member) || 'chat'

        await interaction.editReply({ content: `**Deleted ${i} messages from ${who}**` });
	}
};