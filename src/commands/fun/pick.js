const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pick')
		.setDescription('Get a random option from your choices.')
        .addStringOption(option =>
            option.setName('choice')
                .setDescription('Choice 1.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('choice2')
                .setDescription('Choice 2')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('choice3')
                .setDescription('Choice 3')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('choice4')
                .setDescription('Choice 4')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('choice5')
                .setDescription('Choice 5')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('choice6')
                .setDescription('Choice 6')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('choice7')
                .setDescription('Choice 7')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('choice8')
                .setDescription('Choice 8')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('choice9')
                .setDescription('Choice 9')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('choice10')
                .setDescription('Choice 10')
                .setRequired(false)
        ),
	async execute(interaction) {
        const { _, options } = interaction;
        const answers = []

        // Push picks from the user to an array
        for (const choice of options._hoistedOptions) {
            if (choice && choice.value) {
                answers.push(choice.value);
            }
        }
        // Selects from an array
        const message = `> **${interaction.user.username}:** ${answers.join(', ')}\n**A: **${answers[Math.floor(Math.random() * answers.length)]}`
        await interaction.reply(message)
    },
};