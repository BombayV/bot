const { SlashCommandBuilder } = require('@discordjs/builders');
const { Octokit, App } = require('octokit');

const { GITHUB_AUTH, COLOR } = require('../../config.js').Config;
const Capitilize = require('../../utils/capString.js')

const octokit = new Octokit({
    auth: GITHUB_AUTH
});

module.exports = {
	data: new SlashCommandBuilder()
		.setName('getrepo')
		.setDescription('Gets a repo based on parameters')
        .addStringOption(option =>
            option.setName('user')
                .setDescription('Username of user/organization.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('repo')
                .setDescription('Repository name.')
                .setRequired(true)
        ),
	async execute(interaction) {
        const userAuth = await octokit.rest.users.getAuthenticated()
        .catch((err) => {
            console.log(`[ERROR/GITHBU]: Could not authenticate. Read below.\n` + err);
            return;
        });
        if (!userAuth) return await interaction.reply('Could not authenticate with Github!');

        const { _, options } = interaction;

        const userName = options.getString('user', true);
        const repoName = options.getString('repo', true);

        if (!userName || !repoName) return;

        const repoLink = `https://github.com/${userName}/${repoName}`

        const repo = await octokit.request('GET /repos/{owner}/{repo}', {
            owner: userName,
            repo: repoName
        }).catch((err) => {
            console.log(`[ERROR/GITHUB]: Could not find repo named ${repoLink}. Read below.\n` + err)
            return;
        })

        if (repo && repo.status == 200) {
            console.log(repo);
            const exampleEmbed = {
                color: COLOR,
                title: repo.data.full_name,
                url: repoLink,
                description: repo.data.description,
                thumbnail: {
                    url: repo.data.owner.avatar_url,
                },
                fields: [
                    {
                        name: 'Repo Visiblity',
                        value: repo.data.visibility.Capitilize(),
                    },
                    {
                        name: 'Stars',
                        value: `*${repo.data.stargazers_count} stars*`,
                        inline: true,
                    },
                    {
                        name: 'Open Issues',
                        value: `*${repo.data.open_issues_count} issues*`,
                        inline: true,
                    },
                    {
                        name: 'Forks',
                        value: `*${repo.data.forks_count} forks*`,
                        inline: true,
                    },
                    {
                        name: 'Topics',
                        value: `*[${repo.data.topics}]*`,
                        inline: true,
                    }
                ],
                timestamp: repo.data.pushed_at,
                footer: {
                    text: 'Last update to repo',
                },
            };
            await interaction.reply({ embeds: [exampleEmbed] });
        } else {
            await interaction.reply(`Could not find ${repoLink}`);
        }
	},
};