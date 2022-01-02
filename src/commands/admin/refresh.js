const { SlashCommandBuilder } = require('@discordjs/builders');
const exec = require('child_process').exec;
const HasPerms = require('../../utils/permissions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('refresh')
		.setDescription('Refreshes (/) commands'),
	async execute(interaction) {
        // Check if user has perms
        if (!HasPerms(interaction.member._roles)) return await interaction.reply({ content: 'You do not have permissions for this command!', ephemeral: true });
        await interaction.deferReply({ ephemeral: true });

        // Execute js file
        const load = await exec('node src/utils/refreshCmd.js', (err, inpResp, inpErr) => {
            console.log('[INFO/COMMAND]: ' + inpResp);
            console.log('[ERROR/COMMAND]: ' + (inpErr || 'None'));
            if (err !== null) {
                console.log('[ERROR/COMMAND]: ' + err);
            }
        });

        // Check if it was killed
        if (load.killed) {
            return await interaction.editReply({ content: `Execution was killed!` });
        }
        await interaction.editReply({ content: `Commands have been refreshed!` });
	}
};