const { SlashCommandBuilder } = require('@discordjs/builders');
const getNumber = require('../../utils/minMax.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dice')
		.setDescription('Throw a dice/s to test your luck.')
        .addNumberOption(option =>
            option.setName('dices')
                .setDescription('Number of dices.')
                .setRequired(false)
        )
        .addNumberOption(option =>
            option.setName('min')
                .setDescription('Min dots on dice [1, 12].')
                .setRequired(false)
        )
        .addNumberOption(option =>
            option.setName('max')
                .setDescription('Max dots on dice [1, 12].')
                .setRequired(false)
        ),
	async execute(interaction) {
        const { _, options } = interaction;
        const dices = options.getNumber('dice') || 1;
        const min = options.getNumber('min') || 1;
        const max = options.getNumber('max') || 6;
        if (dices < 1) return await interaction.reply('Cannot throw less than one dice.');
        if (min > max) return await interaction.reply('Min number has to be lower than max.');

        let total = 0;
        const numbers = [];
        for (let i = 0; i < dices; i++) {
            const value = getNumber(min, max);
            total += value;
            numbers.push(`**Dice ${i + 1}:** ${value}`);
        }

		await interaction.reply(numbers.join('\n') + '\n**Total:** ' + total);
	},
};