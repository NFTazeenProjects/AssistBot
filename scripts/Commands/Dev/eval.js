const {reactionEmojis} = require('../../Library/emoji');
module.exports.execute = async (client, flag, arg, M) => {
    if (!arg) return M.reply('Sorry you need to provide some code to evaluate!');
    let evaled = '';
    try {
        evaled = await eval(arg);
        if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
        if (evaled.length > 1000) {
            const { url } = await client.utils.hastebin(evaled);
            return M.reply(`*Output is too long, uploaded to ${url}!*`);
        }
        const messageOptions = {
            text: `📤 *Output:*\n\`\`\`${evaled}\`\`\``,
            contextInfo: {
                externalAdReply: {
                    title: '📚 Code evaluating',
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
        const reactionMessage = {
            react: {
                text: reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)],
                key: M.key, 
            }
        };
        await client.sendMessage(M.from, reactionMessage, { sendEphemeral: true });
    }
    catch (err) {
        console.error(err);
        return M.reply(`*Error:*\n\`\`\`${err}\`\`\``);
    }
}
module.exports.command = {
    name: 'eval',
    aliases: ['e'],
    category: 'dev',
    exp: 0,
    usage: '[code]',
    description: 'Evaluates JavaScript'
}
