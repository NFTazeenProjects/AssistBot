const { reactionEmojis } = require('../../Library/emoji');
const axios = require('axios');

module.exports.execute = async (client, flag, arg, M) => {
    if (!arg) {
        return M.reply('❌ *Please provide a GitHub username, repository (username/repo), or full GitHub URL.*');
    }

    let username, repo, responseText, responseOptions;

    if (arg.includes('github.com')) {
        const urlParts = arg.split('/');
        const usernameIndex = urlParts.indexOf('github.com') + 1;

        if (urlParts.length > usernameIndex + 1) {
            username = urlParts[usernameIndex];
            repo = urlParts[usernameIndex + 1].replace('.git', '');
        } else {
            return M.reply('❌ *Invalid GitHub URL. Please provide a valid username or repository.*');
        }
    } else {
        [username, repo] = arg.split('/');
    }

    try {
        if (!username) {
            return M.reply('❌ *Invalid GitHub input. Please provide a valid username or repository.*');
        }

        if (!repo) {
            const userInfo = await axios.get(`https://api.github.com/users/${username}`);

            if (userInfo.data === undefined) {
                return void M.reply('❌ *Failed to fetch user information from GitHub.*');
            }

            const {
                name,
                email,
                location,
                bio,
                followers,
                following,
                public_repos,
                avatar_url
            } = userInfo.data;

            responseText = `*📝 Name:* ${name}\n` +
                (email !== null ? `*📧 Email:* ${email}\n` : '') +
                (location !== null ? `*📍 Location:* ${location}\n` : '') +
                (bio !== null ? `*ℹ️ Bio:* ${bio}\n` : '') +
                `*👥 Followers:* ${followers}\n*👥 Following:* ${following}\n` +
                `*📚 Repositories:* ${public_repos}\n`;

            responseOptions = {
                text: responseText,
                contextInfo: {
                    externalAdReply: {
                        title: '📚 AssistBot GitHub',
                        body: '@AssistBot',
                        thumbnail: await client.utils.getBuffer(avatar_url),
                        mediaType: 1,
                        mediaUrl: '',
                        sourceUrl: `http://github.com/${username}`,
                        ShowAdAttribution: true,
                    },
                },
            };

        } else {
            const repoInfo = await axios.get(`https://api.github.com/repos/${username}/${repo}`);

            if (repoInfo.data === undefined) {
                return void M.reply('❌ *Failed to fetch repository information from GitHub.*');
            }

            const {
                name,
                description,
                license,
                stargazers_count,
                language,
                forks_count,
                open_issues_count,
                created_at,
                updated_at
            } = repoInfo.data;

            responseText = `*📛 Repository Name:* ${name}\n` +
                `*ℹ️ Description:* ${description || '-'}\n` +
                `*📜 License:* ${license && license.name ? license.name : 'Not specified'}\n` +
                `*⭐ Stars:* ${stargazers_count}\n` +
                `*💻 Language:* ${language || 'Not specified'}\n` +
                `*🍴 Forks:* ${forks_count}\n` +
                `*⚠️ Issues:* ${open_issues_count}\n` +
                `*📅 Created:* ${created_at}\n` +
                `*🔄 Updated:* ${updated_at.slice(0, 10)}\n`;

            responseOptions = {
                text: responseText,
                contextInfo: {
                    externalAdReply: {
                        title: '📚 AssistBot GitHub',
                        body: '@AssistBot',
                        thumbnail: await client.utils.getBuffer('https://i.pinimg.com/564x/21/f9/44/21f9446aebcb382791c4f6613adc413d.jpg'),
                        mediaType: 1,
                        mediaUrl: '',
                        sourceUrl: `http://github.com/${username}/${repo}`,
                        ShowAdAttribution: true,
                    },
                },
            };
        }

        if (responseOptions) {
            await client.sendMessage(M.from, responseOptions, { quoted: M });

            const reactionMessage = {
                react: {
                    text: reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)],
                    key: M.key,
                },
            };

            await client.sendMessage(M.from, reactionMessage, { sendEphemeral: true });
        }
    } catch (error) {
        console.error('Error in GitHub:', error);
        return M.reply('❌ *An error occurred while accessing GitHub. Please try again later.*');
    }
}

module.exports.command = {
    name: 'gitsearch',
    aliases: ['github', 'git', 'gits', 'gitsearch', 'repo'],
    category: 'education',
    usage: '[username/repo or full GitHub URL]',
    exp: 5,
    description: '🤖 Get GitHub information about a user/repo'
}
