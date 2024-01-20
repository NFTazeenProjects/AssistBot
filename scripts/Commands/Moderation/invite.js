const { reactionEmojis } = require('../../Library/emoji');

module.exports.execute = async (client, flag, arg, M) => {
    const invitelink = (await client.DB.get('invitelink')) || [];
    if (!invitelink.includes(M.from)) {
        return M.reply(`📄 *Invitelink is not registered with the bot. Please contact the bot admin to get access.*`);
    }
    const code = await client.groupInviteCode(M.from);

    // Message options to send the group link with external ad reply
    const messageOptions = {
        text: '*🧑‍🚀Here is the group link:* \nhttps://chat.whatsapp.com/' + code + '\n\n*Note:* This link is not to share with others, who are not worthy of it.',
        contextInfo: {
            externalAdReply: {
                title: '📄 Group Link',
                body: '@AssistBot',
                thumbnail: await client.utils.getBuffer('https://i.pinimg.com/564x/d8/11/10/d81110f74b45542aa26eddc290592ed8.jpg'),
                mediaType: 1,
                mediaUrl: 'https://chat.whatsapp.com/' + code,
                sourceUrl: 'https://chat.whatsapp.com/FvjX39MiPWp0KlPUpGd8mk',
                ShowAdAttribution: true,
            },
        },
    };

    // Send the group link with the message options
    await client.sendMessage(M.from, messageOptions);

    // Reaction message using the imported reactionEmojis
    const reactionMessage = {
        react: {
            text: reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)],
            key: M.key,
        },
    };
    await client.sendMessage(M.from, reactionMessage, { sendEphemeral: true });
}
module.exports.command = {
    name: 'invite',
    aliases: ['inv', 'gclink', 'grouplink'],
    exp: 10,
    usage: '[link]',
    category: 'moderation',
    description: 'Get the group link',
};
