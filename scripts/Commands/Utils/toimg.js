const { text } = require('figlet');
const {reactionEmojis} = require('../../Library/emoji');

module.exports.execute = async (client, flag, arg, M) => {
    if (!M.quoted || (M.quoted && M.quoted.mtype !== 'stickerMessage'))
        return M.reply('❌ *Reply to a sticker to convert it to an image/gif*');
    
    const buffer = await M.quoted.download();
    const animated = M.quoted?.message?.stickerMessage?.isAnimated;
    const type = animated ? 'video' : 'image';
    try {
        const result = animated ? await client.utils.webpToMp4(buffer) : await client.utils.webpToPng(buffer);
        const messageOptions = {
            [type]: result,
            gifPlayback: animated ? true : undefined,
            contextInfo: {
                externalAdReply: {
                    title: `Sticker to ${type}`,
                    body: '🔥 AssistBot 🔥',
                    thumbnail: await client.utils.getBuffer('https://i.pinimg.com/736x/60/76/2d/60762d2abf0c0762d461e6206834ba06.jpg'),
                    mediaType: 1,
                    mediaUrl: '',
                    sourceUrl: 'https://chat.whatsapp.com/FvjX39MiPWp0KlPUpGd8mk',
                    ShowAdAttribution: true,
                },
            },
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
    }
    catch (err) {
        console.error('❌ An error occurred while converting the image/video/gif to a sticker:', err);
    }
}

module.exports.command = {
    name: 'toimg',
    aliases: ['img'],
    category: 'utils',
    usage: '[quote the image]',
    exp: 10,
    description: 'Converts sticker to image/gif'
};
