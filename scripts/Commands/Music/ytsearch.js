const yts = require('yt-search');
const { reactionEmojis } = require('../../Library/emoji');
module.exports.execute = async (client, flag, arg, M) => {
    if (!arg) {
        return M.reply('❌ *Sorry, you did not provide any search term!*');
    }

    // Perform a YouTube video search with the provided query
    const { videos } = await yts(arg.trim());

    if (!videos || !videos.length) {
        return M.reply(`🔍 *No videos found for "${arg}"*`);
    }

    let text = '';
    const maxResults = Math.min(videos.length, 5);

    for (let i = 0; i < maxResults; i++) {
        text += `🎬 *Video #${i + 1}*\n🌟 *Title:* ${videos[i].title}\n👤 *By:* ${videos[i].author.name}\n⏱️ *Duration:* ${videos[i].seconds} seconds\n▶️ *Watch it:* ${videos[i].url}\n\n`;
    }

    const messageOptions = {
        text: text,
        contextInfo: {
            externalAdReply: {
                title: '🎬 YouTube Search Result',
                body: '@AssistBot',
                thumbnail: await client.utils.getBuffer('https://i.pinimg.com/564x/dd/78/ba/dd78bac58c989968fbe27f3878c5631f.jpg'),
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
        },
    };
    await client.sendMessage(M.from, reactionMessage, { sendEphemeral: true });
};
module.exports.command = {
    name: 'ytsearch',
    aliases: ['yts'],
    category: 'media',
    usage: '[term]',
    exp: 5,
    description: 'Search for YouTube videos based on a query',
};
