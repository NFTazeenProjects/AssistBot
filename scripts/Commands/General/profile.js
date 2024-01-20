const {reactionEmojis} = require('../../Library/emoji');
const { getStats } = require('../../Library/stats');

module.exports.execute = async (client, flag, arg, M) => {
    const groupMetadata = await client.groupMetadata(M.from);
    const groupMembers = groupMetadata?.participants || [];
    const groupAdmins = groupMembers.filter((v) => v.admin).map((v) => v.id);
    const user = M.mentions[0] ?? M.sender;

    let pfp;
    try {
        pfp = await client.profilePictureUrl(user, 'image');
    } catch {
        pfp =
            'https://img.freepik.com/free-vector/oops-404-error-with-broken-robot-concept-illustration_114360-5529.jpg';
    }

    let bio;
    try {
        bio = (await client.fetchStatus(user)).status;
    } catch {
        bio = '';
    }

    const level = (await client.DB.get(`${user}_LEVEL`)) || 1;
    const { requiredXpToLevelUp, rank } = getStats(level);
    const username = (await client.contact.getContact(user, client)).username;
    const experience = (await client.exp.get(user)) || 0;
    const banned = (await client.DB.get('banned')) || [];

    let text = '';
    text += '👤 *Username: ' + username + '#' + user.substring(3, 7) + '*\n\n';
    text += '💬 *Bio: ' + bio + '*\n\n';
    // text += '📞 *Number: wa.me/' + user.split('@')[0] + '*\n\n';
    text += '✨ *Experience: ' + experience + '*\n\n';
    text += '🥇 *Level: ' + level + '*\n\n';
    text += '📊 *Rank: ' + rank + '*\n\n';
    text += '🔥 *Required XP to Level Up: ' + requiredXpToLevelUp + ' exp required* \n\n';
    text += '👑 *Admin: ' + (groupAdmins.includes(user) ? 'T' : 'F') + '*\n\n';
    text += '🚫 *Ban: ' + (banned.includes(user) ? 'T' : 'F') + '*';

    const image = pfp; 

    const messageOptions = {
        text: text,
        contextInfo: {
            externalAdReply: {
                title: `🏆 Your Profile`,
                body: '@AssistBot',
                thumbnail: await client.utils.getBuffer(image),
                mediaType: 1,
                mediaUrl: 'https://wa.me/917842346461',
                sourceUrl: 'https://wa.me/' + user.split('@')[0],
                ShowAdAttribution: true
            }
        }
    };
    await client.sendMessage(M.from, messageOptions, { quoted: M });
    const reactionMessage = {
        react: {
            text: reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)],
            key: M.key, 
        }
    };
    await client.sendMessage(M.from, reactionMessage, { sendEphemeral: true });
    return;
};

module.exports.command = {
    name: 'profile',
    aliases: ['p'],
    category: 'general',
    usage: '',
    exp: 5,
    description: 'Gives you your stats'
};
