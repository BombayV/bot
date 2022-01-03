const { SlashCommandBuilder } = require('@discordjs/builders');
const { GetNumber } = require('../../utils/variedUtils');

// Constants that will change the results
const CONSTANTS = {
    dices: {
        min: 1,
        max: 6
    },
    min: 1,
    max: 20
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dice')
		.setDescription('Throw a dice/s to test your luck.')
        .addNumberOption(option =>
            option.setName('dices')
                .setDescription(`Number of dices [${CONSTANTS.dices.min}, ${CONSTANTS.dices.max}].`)
                .setMinValue(CONSTANTS.dices.min)
                .setMaxValue(CONSTANTS.dices.max)
                .setRequired(false)
        )
        .addNumberOption(option =>
            option.setName('min')
                .setDescription(`Minimum dots on dice [${CONSTANTS.min}, ${CONSTANTS.max}].`)
                .setMinValue(CONSTANTS.min)
                .setMaxValue(CONSTANTS.max)
                .setRequired(false)
        )
        .addNumberOption(option =>
            option.setName('max')
                .setDescription(`Maximum dots on dice [${CONSTANTS.min}, ${CONSTANTS.max}].`)
                .setMinValue(CONSTANTS.min)
                .setMaxValue(CONSTANTS.max)
                .setRequired(false)
        ),
	async execute(interaction) {
        // Get options
        const { _, options } = interaction;
        const dices = options.getNumber('dices') || 1;
        const min = options.getNumber('min') || 1;
        const max = options.getNumber('max') || 6;

        // Check if dices are correct
        if (dices > CONSTANTS.dices.max || dices < CONSTANTS.dices.min) return await interaction.reply('Incorrect amount of dices.');
        if (min > CONSTANTS.max || min < CONSTANTS.min) return await interaction.reply('Incorrect minimum number of sides.');
        if (max > CONSTANTS.max || max < CONSTANTS.min) return await interaction.reply('Incorrect maximum number of sides.');
        if (min > max) return await interaction.reply('Min number has to be lower than max.');

        // Calculate and add results
        let total = 0;
        const numbers = [];
        for (let i = 0; i < dices; i++) {
            const value = GetNumber(min, max);
            total += value;
            numbers.push(`**Dice ${i + 1}:** ${value}`);
        }

		await interaction.reply(numbers.join('\n') + '\n**Total:** ' + total);
	},
};