const { SlashCommandBuilder } = require('@discordjs/builders');
const exec = require('child_process').exec;
const HasPerms = require('../../utils/permissions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('refresh')
		.setDescription('Refreshes (/) commands'),
	async execute(interaction) {
        if (HasPerms(interaction.member._roles)) {
            await interaction.deferReply({ ephemeral: true });
            const load = await exec('node src/utils/slashCommands.js', (err, inpResp, inpErr) => {
                console.log('[INFO/COMMAND]: ' + inpResp);
                console.log('[ERROR/COMMAND]: ' + (inpErr || 'None'));
                if (err !== null) {
                    console.log('[ERROR/COMMAND]: ' + err);
                }
            });
            if (!load.killed) {
                await interaction.editReply({ content: `Commands have been refreshed!` });
            } else {
                await interaction.editReply({ content: `Execution was killed!` });
            }
        } else {
            await interaction.reply({ content: 'You do not have permissions for this command!', ephemeral: true });
        }
	}
};