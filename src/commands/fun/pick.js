const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pick')
		.setDescription('Pick.')
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
                .setRequired(true)
        ),
	async execute(interaction) {
        const choice = options.getString('choice');
        

            
    },
};