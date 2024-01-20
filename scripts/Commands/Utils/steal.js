const { Sticker, StickerTypes } = require('wa-sticker-formatter')
const { reactionEmojis } = require('../../Library/emoji')
module.exports.execute = async (client, flag, arg, M) => {
    const content = JSON.stringify(M.quoted)
    const isQuotedSticker = M.type === 'extendedTextMessage' && content.includes('stickerMessage')

    if (isQuotedSticker) {
        const pack = arg.split('|')
        const buffer = await M.quoted.download()
        const sticker = new Sticker(buffer, {
            pack: pack[1] ? pack[1].trim() : 'Handcrafted for you by',
            author: pack[2] ? pack[2].trim() : `AssistBot 🤖`,
            type: StickerTypes.FULL,
            categories: ['🤩', '🎉'],
            quality: 70
        })
        const messageOptions = {
            sticker: await sticker.build(),
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
    }
    return M.reply('❌ *Caption/Quote a sticker message*')
}
module.exports.command = {
    name: 'steal',
    aliases: ['take'],
    category: 'utils',
    usage: '[quote the sticker] |PackName|AuthorName',
    exp: 10,
    description: 'Changes the sticker Pack and Author name'
}