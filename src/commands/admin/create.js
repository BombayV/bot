const { SlashCommandBuilder } = require('@discordjs/builders');
const { Capitilize } = require('../../utils/variedUtils');
const fs = require('fs');
const HasPerms = require('../../utils/permissions');
const TxtCreate = require('../../utils/txtCreate');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create')
		.setDescription('Create a new command.')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Command name.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('title')
                .setDescription('Title of help guide')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('description')
                .setDescription('Command description')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Message for a solution to the problem.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('url')
                .setDescription('Link for some help.')
                .setRequired(false)
        ),
	async execute(interaction) {
        // Check for perms
        if (!HasPerms(interaction.member._roles)) return await interaction.reply({ content: 'You do not have permissions for this command!', ephemeral: true });

        // Defer reply so that there's time to create command.
        await interaction.deferReply( { ephemeral: true} );

        const { _, options } = interaction;
        const commandName = options.getString('name')?.toLowerCase();
        const title = options.getString('title')?.Capitilize();
        const description = options.getString('description')?.Capitilize();
        const message = options.getString('message')?.Capitilize();
        const url = options.getString('url') || ':(';

        if (!commandName || !title || !message || !description || !url) return await interaction.editReply({ content: `Missing fields for command` });
        if (/^\s*$/.test(commandName)) return await interaction.editReply({ content: `Command **${commandName}** cannot have spaces.`});

        fs.writeFile(`./src/commands/manual/${commandName}.txt`, `#title ${title}\n#description ${description}\n#url ${url}\n${message}`, function(err) {
            console.log('[INFO/COMMAND]: Create new command ' + commandName);
            if (err !== null) {
                console.log('[ERROR/COMMAND]: ' + err);
            }
        });

        const txtCmd = TxtCreate(`#title ${title}\n#description ${description}\n#url ${url}\n${message}`, `src/commands/manual/${commandName}.txt`);
        if (txtCmd.data) {
            interaction.client.commands.set(txtCmd.data.name, txtCmd);
        }

        await interaction.editReply({ content: `Command created!` });
	}
};