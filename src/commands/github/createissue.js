const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { Octokit } = require('octokit');

const { GITHUB_AUTH } = require('../../config').Config;
const { Capitilize } = require('../../utils/variedUtils');
const { COLOR } = require('../../config').Config;
const HasPerms = require('../../utils/permissions');

// Register authentication
const octokit = new Octokit({
    auth: GITHUB_AUTH
});

module.exports = {
	data: new SlashCommandBuilder()
		.setName('createissue')
		.setDescription('Creates a new issue based on parameters')
        .addStringOption(option =>
            option.setName('user')
                .setDescription('Username of user/organization.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('repo')
                .setDescription('Repository name.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('title')
                .setDescription('Issue title.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('body')
                .setDescription('Issue body description.')
                .setRequired(true)
        ),
	async execute(interaction) {
        if (!HasPerms(interaction.member._roles)) return await interaction.reply({ content: 'You do not have permissions for this command!', ephemeral: true });

        // Check for auth with github
        const userAuth = await octokit.rest.users.getAuthenticated()
        .catch((err) => {
            console.log(`[ERROR/GITHUB]: Could not authenticate. Read below.\n` + err);
            return;
        });
        if (!userAuth) return await interaction.reply('Could not authenticate with Github!');

        const { _, options } = interaction;

        const userName = options.getString('user', true);
        const repoName = options.getString('repo', true);

        if (!userName || !repoName) return await interaction.reply(`No user or repo set.`);

        const title = `[Discord] ${options.getString('title', true)}`;
        const body = options.getString('body', true)?.Capitilize();

        if (!title || !body) return await interaction.reply(`No title or body set.`);

        const repoLink = `https://github.com/${userName}/${repoName}`
        const repo = await octokit.request('POST /repos/{owner}/{repo}/issues', {
            owner: userName,
            repo: repoName,
            title: title,
            body: body
        }).catch((err) => {
            console.log(`[ERROR/GITHUB]: Could not find repo named ${repoLink}. Read below.\n` + err)
            return;
        })

        if (!repo) return await interaction.reply(`Could not create issue.`);

        // Create embed
        const issueEmbed = new MessageEmbed()
            .setColor(COLOR)
            .setTitle('Issue Created')
            .setURL(repo.data.url)
            .setThumbnail(repo.data.user.avatar_url)
            .setFields([
                { name: 'Title', value: title },
                { name: 'Body', value: `*${body}*`, inline: true }
            ])
            .setTimestamp()
            .setFooter({ text: 'Creation date'})

        await interaction.reply({embeds: [issueEmbed]});
	},
};