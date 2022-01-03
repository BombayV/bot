const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { COLOR } = require('../../config').Config;
const HasPerms = require('../../utils/permissions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kick an user')
        .addUserOption(option =>
            option.setName('member')
                .setDescription('Member in the guild.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the kick.')
                .setRequired(false)
        ),
	async execute(interaction) {
        // Check for perms
        if (!HasPerms(interaction.member._roles)) return await interaction.reply({ content: 'You do not have permissions for this command!', ephemeral: true });

        // Defer reply so that there's time to kick user.
        await interaction.deferReply();

        // Check for member input
        const { _, options } = interaction;
        const member = options.getMember('member');
        if (!member) return await interaction.editReply({ content: `No user input!` });
        if (!member?.id) return await interaction.editReply({ content: `Could not find user in guild!` });

        if (!member.kickable) return await interaction.editReply({ content: `<@${member?.id}> is not kickable.` });
        if (!member.moderatable) return await interaction.editReply({ content: `Do not have permissions to timeout <@${member.id}>.`})
        try {
            const adminId = interaction.user.id;
            const reason = options.getString('reason') || 'No reason specified.';

            // Timeout embed
            const timeoutEmbed = new MessageEmbed()
                .setColor(COLOR)
                .setTitle('User Kicked')
                .setThumbnail(
                    member.user.displayAvatarURL({
                        format: 'png',
                        dynamic: true,
                        size: 96
                    })
                )
                .addFields(
                    { name: 'Username', value: `<@${member.id}>`, inline: true },
                    { name: 'User Id', value: member.id, inline: true },
                    { name: 'Staff Name', value: `<@${adminId}>`, inline: false },
                    { name: 'Reason', value: reason, inline: false }
                )
                .setTimestamp();

            // Ban member with delete days
            member.kick(reason);
            return await interaction.editReply({ embeds: [timeoutEmbed] })
        } catch (err) {
            console.log(err)
            return await interaction.editReply({ content: `<@${member.id}> could not be kicked.` })
        }
	}
};