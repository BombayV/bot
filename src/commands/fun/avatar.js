const { SlashCommandBuilder } = require('@discordjs/builders');
const Color = require('../../config').Config.COLOR;

const Size = {
    ['xs']: 128,
    ['s']: 256,
    ['m']: 512,
    ['l']: 1024,
    ['xl']: 2048
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Shows the avatar of an user.')
        .addStringOption(option =>
            option.setName('size')
                .setDescription('Size of the user avatar.')
                .setRequired(false)
                .addChoices([
                    ['Extra Small', 'xs'],
                    ['Small', 's'],
                    ['Medium', 'm'],
                    ['Large', 'l'],
                    ['Extra Large', 'xl']
                ])
        )
        .addUserOption(option =>
            option.setName('member')
                .setDescription('Member in the guild.')
                .setRequired(false)
        ),
	async execute(interaction) {
        const { _, options } = interaction;
        const imageSize = options.getString('size') || 's';
        const user = options.getUser('member') || interaction.user;

        const avatar = {
            color: Color,
            title: user.username,
            description: `**Size: ${imageSize}**`,
            image: {
                url: user.displayAvatarURL({
                    format: 'png',
                    dynamic: true,
                    size: Size[imageSize]
                }),
            },
            timestamp: new Date()
        };

		await interaction.reply({embeds : [avatar]});
	},
};