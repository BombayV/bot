const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { COLOR } = require('../../config').Config;
const HasPerms = require('../../utils/permissions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('timeout')
		.setDescription('Timeout an user')
        .addUserOption(option =>
            option.setName('member')
                .setDescription('Member in the guild.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('duration')
                .setDescription('Duration of ban (1d, 1h, 1d, 1w)')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the timeout.')
                .setRequired(false)
        ),
	async execute(interaction) {
        // Check for perms
        if (!HasPerms(interaction.member._roles)) return await interaction.reply({ content: 'You do not have permissions for this command!', ephemeral: true });

        // Defer reply so that there's time to timeout user.
        await interaction.deferReply();

        // Check for member input
        const { _, options } = interaction;
        const member = options.getMember('member');
        if (!member) return await interaction.editReply({ content: `No user input!` });
        if (!member?.id) return await interaction.editReply({ content: `Could not find user in guild!` });

        if (!member.moderatable) return await interaction.editReply({ content: `Do not have permissions to timeout <@${member.id}>.`})

        // If timeout did not pass, check for duration
        const timeStr = options.getString('duration') || false;
        if (!timeStr) {
            const endedTimeout = await member.timeout(null, 'Timeout has been removed!');
            if (!endedTimeout) return await interaction.editReply({ content: `Could not end timeout.` });
            return await interaction.editReply({ content: `<@${member.id}> your timeout has ended.` });
        }

        // Time regex
        const time = (timeStr && timeStr.match(/\d+|\D+/g));
        let duration = parseInt(Math.ceil(time[0])) || 0;
        const type = (time[1] && time[1].toLowerCase());

        if (duration < 1) return await interaction.editReply({ content: `**Duration cannot be less than zero.**` });
        if (!type) return await interaction.editReply({ content: `**Did not specify duration format ("m", "h", "d", "w") or duration.**` });
        switch (type) {
            case 'm':
                duration *= (60 * 1000)
                break;
            case 'h':
                duration *= (60 * 60 * 1000)
                break;
            case 'd':
                duration *= (24 * 60 * 60 * 1000)
                break;
            case 'w':
                duration *= (7 * 24 * 60 * 60 * 1000)
                break;

            default:
                return await interaction.editReply({ content: `**Wrong duration format, use duration (number) and "m", "h", "d", "w".**` });
        };

        try {
            const adminId = interaction.user.id;
            const reason = options.getString('reason') || 'No reason specified.';
            // Timeout embde
            const timeoutEmbed = new MessageEmbed()
            .setColor(COLOR)
            .setTitle('User Timed Out')
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
                { name: 'Reason', value: reason, inline: false },
                { name: 'Duration', value: timeStr }
            )
            .setTimestamp();

            // Ban member with delete days
            member.timeout(duration, reason);
            return await interaction.editReply({ embeds: [timeoutEmbed] })
        } catch (err) {
            console.log(err)
            return await interaction.editReply({ content: `<@${member.id}> could not be timed out.` })
        }
	}
};