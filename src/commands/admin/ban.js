const { SlashCommandBuilder } = require('@discordjs/builders');
const HasPerms = require('../../utils/permissions');
const { NewBan, GetBanned } = require('../../db/actions/banAction');

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
        if (HasPerms(interaction.member._roles)) {
            await interaction.deferReply();
            const { _, options } = interaction;
            const user = options.getMember('member');
            if (!user) return await interaction.editReply({ content: `No user input!` })
            if (!user.id) return await interaction.editReply({ content: `Could not find user in guild!` });
            const banStatus = await GetBanned(user.id);
            if (banStatus) return await interaction.editReply({ content: `User is already banned.` });
            if (user.bannable) {
                const adminId = interaction.user.id;
                const reason = options.getString('reason') || 'No reason specified.';
                const deleteDays = options.getNumber('days') || 0;
                const timeStr = options.getString('duration');
                const time = (timeStr && timeStr.match(/\d+|\D+/g)) || 'perma';
                if (time[0] === 'perma' || time == 'perma') {
                    const wasBanned = await user.ban({ reason: reason, days: deleteDays});
                    if (wasBanned) {
                        const banned = await NewBan(interaction.guild.id, user.id, adminId, reason, true, new Date()).catch((err) => console.log);
                        if (banned) {
                            return await interaction.editReply({ content: `<@${user.id}> has been permabanned. Hopefully he had a nice visit.` })
                        } else {
                            return await interaction.editReply({ content: `<@${user.id}> user was already banned.` })
                        }
                    } else {
                        return await interaction.editReply({ content: `<@${user.id}> could not be banned.` })
                    }
                }
                let duration = parseInt(Math.ceil(time[0]));
                const type = (time[1] && time[1].toLowerCase());
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
                        return await interaction.editReply({ content: `**Wrong duration format, use duration (number) and "m", "h", "d".**` });
                };

                const expires = new Date();
                expires.setMinutes(expires.getMinutes() + duration);
                const embed = {

                }

                const wasBanned = await user.ban({ reason: reason, days: deleteDays});
                if (wasBanned) {
                    const banned = await NewBan(interaction.guild.id, user.id, adminId, reason, false, expires).catch((err) => console.log);
                    if (banned) {
                        return await interaction.editReply({ content: `<@${user.id}> has been banned for ${timeStr}. Hopefully he had a nice visit.` })
                    } else {
                        return await interaction.editReply({ content: `<@${user.id}> user was already banned.` })
                    }
                } else {
                    return await interaction.editReply({ content: `<@${user.id}> could not be banned.` })
                }
            } else {
                return await interaction.editReply({ content: `<@${user.id}> is not bannable.` })
            }
        } else {
            return await interaction.reply({ content: 'You do not have permissions for this command!'});
        }
	}
};