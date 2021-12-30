const { SlashCommandBuilder } = require('@discordjs/builders');
const exec = require('child_process').exec;
const HasPerms = require('../../utils/permissions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('refresh')
		.setDescription('Refreshes (/) commands'),
	async execute(interaction) {
        if (HasPerms(interaction.member._roles)) {
            await interaction.deferReply({ ephemeral: true });
            await new Promise(res => setTimeout(res, 3000, true));
            await interaction.editReply({ content: `Commands have been refreshed!` });

            exec('node src/utils/slashCommands.js', (err, inpResp, inpErr) => {
                console.log('[INFO/COMMAND]: ' + inpResp);
                console.log('[ERROR/COMMAND]: ' + (inpErr || 'None'));
                if (err !== null) {
                    console.log('[ERROR/COMMAND]: ' + err);
                }
            });
        } else {
            await interaction.reply({ content: 'You do not have permissions for this command!', ephemeral: true });
        }
	}
};