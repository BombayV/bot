const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { NewBan, GetBanned } = require('../../db/actions/banAction');
const { COLOR } = require('../../config').Config;
const HasPerms = require('../../utils/permissions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Ban an user')
        .addUserOption(option =>
            option.setName('member')
                .setDescription('Member in the guild.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('duration')
                .setDescription('Duration of ban (1d, 1h, 1d)')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the ban.')
                .setRequired(false)
        )
        .addNumberOption(option =>
            option.setName('days')
                .setDescription('Amount of days messages should be cleaned.')
                .setRequired(false)
        ),
	async execute(interaction) {
        // Check for perms
        if (!HasPerms(interaction.member._roles)) return await interaction.reply({ content: 'You do not have permissions for this command!', ephemeral: true });

        // Defer reply so that there's time to ban user.
        await interaction.deferReply();

        // Check if user was mentioned
        const { _, options } = interaction;
        const member = options.getMember('member');
        if (!member) return await interaction.editReply({ content: `No user input!` })
        if (!member?.id) return await interaction.editReply({ content: `Could not find user in guild!` });

        // Check if user is banned
        const banStatus = await GetBanned(member.id);
        if (banStatus) return await interaction.editReply({ content: `User is already banned.` });

        // Check if user is bannable
        if (!member.bannable) return await interaction.editReply({ content: `<@${member.id}> is not bannable.` })

        // Data needed for logs and db
        const adminId = interaction.user.id;
        const reason = options.getString('reason') || 'No reason specified.';
        const deleteDays = options.getNumber('days') || 0;

        const timeStr = options.getString('duration')
        const time = (timeStr && timeStr.match(/\d+|\D+/g)) || 'perma';
        let duration = parseInt(Math.ceil(time[0])) || 0;
        const type = (time[1] && time[1].toLowerCase());

        const banEmbed = new MessageEmbed()
            .setColor(COLOR)
            .setTitle('User Banned')
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
                { name: 'Duration', value: timeStr || 'Perma' },
                { name: 'Unban Date', value: 'Permabanned'  }
            )
            .setTimestamp();

        // Duration type
        if (duration < 1) return await interaction.editReply({ content: `**Duration cannot be less than zero.**` });
        if (!type) return await interaction.editReply({ content: `**Did not specify duration format ("m", "h", "d") or duration.**` });
        switch (type) {
            case 'm':
                duration *= 1
                break;
            case 'h':
                duration *= 60
                break;
            case 'd':
                duration *= 60 * 24
                break;

            default:
                if (time !== 'perma') {
                    return await interaction.editReply({ content: `**Wrong duration format, use duration (number) and "m", "h", "d".**` });
                }
        };

        // Set expiration date and perma
        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + duration);
        banEmbed.fields[5].value = expires.toLocaleDateString('en-us');
        let perma = false;

        // Check if person is getting permabanned
        if (time[0] === 'perma' || time == 'perma') {
            perma = true;
            banEmbed.fields[5].value = 'Permabanned';
        }

        try {
            // Ban member with delete days
            member.ban({ reason: reason, days: deleteDays});

            // Add user to ban db
            const banned = await NewBan(interaction.guild.id, member.id, adminId, reason, perma, expires).catch((err) => console.log(err));
            if (banned) {
                return await interaction.editReply({ embeds: [banEmbed] })
            } else {
                return await interaction.editReply({ content: `<@${member.id}> user was already banned.` })
            }
        } catch (err) {
            return await interaction.editReply({ content: `<@${member.id}> could not be banned.` })
        }
	}
};