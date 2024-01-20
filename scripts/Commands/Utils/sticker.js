const {reactionEmojis} = require('../../Library/emoji');
const { Sticker } = require('wa-sticker-formatter');

module.exports.execute = async (client, flag, arg, M) => {
    if (!M.type && (!M.quoted || !M.type || !M.quoted.mtype)) {
        return M.reply('❌ *Caption/Quote an image/video/gif message*');
    }
    const packData = arg.split('|').map(item => item.trim());
    const packName = packData[1] || 'Sticker is by ';
    const authorName = packData[2] || 'GetBenefits 🤖';

    const buffer = M.quoted ? await M.quoted.download() : await M.download();

    const stickerType =
        flag.includes('--c') || flag.includes('--crop')
            ? 'crop'
            : flag.includes('--s') || flag.includes('--stretch')
            ? 'default'
            : flag.includes('--cr') || flag.includes('--circle')
            ? 'circle'
            : 'full';
    try {
        const sticker = await new Sticker(buffer, {
            pack: packName,
            author: authorName,
            categories: ['🤩', '🎉'],
            quality: 70,
            type: stickerType,
        }).build();
        const messageOptions = {
            sticker,
            contextInfo: {
                externalAdReply: {
                    title: '📚 AssistBot Sticker',
                    body: '🔥 @AssistBot 🔥',
                    thumbnail: await client.utils.getBuffer('https://i.pinimg.com/564x/9c/0e/0d/9c0e0dd771694462ee394e8bfbe29869.jpg'),
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
    } catch (err) {
        console.error('❌ An error occurred while converting the image/video/gif to a sticker:', err);
    }
}

module.exports.command = {
    name: 'sticker',
    aliases: ['s'],
    category: 'utils',
    usage: '[quote the video or image] |PackName|AuthorName',
    exp: 15,
    description: 'Converts a normal video or an image into a sticker',
};
