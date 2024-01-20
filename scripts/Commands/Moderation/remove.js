const { reactionEmojis } = require('../../Library/emoji');

module.exports.execute = async (client, flag, arg, M) => {
    // Define an async function to handle sending messages with context info
    const sendWithContextInfo = async (text) => {
        const messageOptions = {
            text: text,
            contextInfo: {
                externalAdReply: {
                    title: 'Assist Bot',
                    body: '@AssistBot',
                    thumbnail: await client.utils.getBuffer('https://i.pinimg.com/564x/3d/90/83/3d9083502a5794811084f5c754104a48.jpg'),
                    mediaType: 1,
                    mediaUrl: '',
                    sourceUrl: 'https://chat.whatsapp.com/FvjX39MiPWp0KlPUpGd8mk',
                    ShowAdAttribution: true,
                },
            },
        };
        await client.sendMessage(M.from, messageOptions, { quoted: M });
    };

    if (!M.mentions.length) {
        // No mentions provided
        return sendWithContextInfo('❌ *Mentions are required to remove users*');
    }
    
    const mentions = client.utils.removeDuplicates(M.mentions);

    if (mentions.length > 5) {
        // Too many mentions (limit: 5)
        return sendWithContextInfo('🚫 *You can only remove up to 5 users at a time. Remove some users and try again*');
    }
    
// Remove the mentioned users from the group
await client.groupParticipantsUpdate(M.from, mentions, 'remove').then((res) => {
    sendWithContextInfo('✅ *Done! Removing' + mentions.length + ' users*');
}).catch((err) => {
    sendWithContextInfo('🚫 *Failed to remove users*');
    console.error(err);
});

        const reactionMessage = {
            react: {
                text: reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)],
                key: M.key, 
            }
        };
        await client.sendMessage(M.from, reactionMessage, { sendEphemeral: true });
    };

module.exports.command = {
    name: 'remove',
    aliases: ['r' , 'rm', 'boom'],
    exp: 10,
    category: 'moderation',
    usage: '[mention user | quote user]',
    description: 'Removes the tagged user',
};
