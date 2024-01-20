const { getStats } = require('../../Library/stats');
const { reactionEmojis } = require('../../Library/emoji');

module.exports.execute = async (client, flag, arg, M) => {
    try {
        const user = M.mentions[0] || M.sender;
        const [username, experience, level] = await Promise.all([
            client.contact.getContact(user, client).then((contact) => contact.username),
            client.exp.get(user),
            client.DB.get(`${user}_LEVEL`),
        ]);

        const { requiredXpToLevelUp, rank } = getStats(level || 1);
        const pfp = await client.profilePictureUrl(user, 'image');
        const profilePicture = pfp || 'https://img.freepik.com/free-vector/oops-404-error-with-broken-robot-concept-illustration_114360-5529.jpg';

        const message = `👤 *User*: ${username}
🌟 *Experience*: ${experience || 0}
🎖️ *Level*: ${level || 1}
📈 *Rank*: ${rank}
🔝 *Required XP to Level Up*: ${requiredXpToLevelUp} XP
`;

        const messageOptions = {
            text: message,
            contextInfo: {
                externalAdReply: {
                    title: `🏆 Rank Information for ${username}`,
                    body: '@AssistBot',
                    thumbnail: await client.utils.getBuffer(profilePicture),
                    mediaType: 1,
                    mediaUrl: '',
                    sourceUrl: 'https://wa.me/' + user.split('@')[0],
                    ShowAdAttribution: true
                }
            }
        };
        await client.sendMessage(M.from, messageOptions, { quoted: M });
        try {
            const reactionMessage = {
                react: {
                    text: reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)],
                    key: M.key, 
                }
            };
            await client.sendMessage(M.from, reactionMessage, { sendEphemeral: true });
        }
        catch (error) {
            console.error(error);
        }
    }   
    catch (error) {
        console.error('Error in rank:', error);
        return M.reply('❌ *An error occurred while getting your rank. Please try again later.*');
    }
};

module.exports.command = {
    name: 'rank',
    aliases: ['rk'],
    category: 'general',
    usage: '',
    exp: 5,
    description: '🏆 Get your rank and experience information',
};
