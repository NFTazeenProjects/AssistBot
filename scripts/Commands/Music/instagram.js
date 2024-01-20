const axios = require('axios');
const {reactionEmojis} = require('../../Library/emoji');

module.exports.execute = async (client, flag, arg, M) => {
    if (!arg) {
        return M.reply('❌ *Sorry, you did not provide any url!*');
    }
    const response = await axios.get(`https://www.guruapi.tech/api/igdlv1?url=${encodeURIComponent(arg)}`);
    if (!response.data.success) {
        return M.reply(`🔍 *No videos found for "${arg}"*`);
    }
    const videoBuffer = await client.utils.getBuffer(response.data.data[0].url_download);
    const messageOptions = {
        video: videoBuffer, 
        mimetype: 'video/mp4',
        caption: `*🔗 Type:* ${response.data.data[0].type}\n*⚡ Thanks for using @AssistBot*`,
        contextInfo: {
            externalAdReply: {
                title: `📰 Instagram Downloader`,
                body: `@AssistBot`,
                thumbnail: await client.utils.getBuffer('https://i.pinimg.com/564x/6e/bf/9f/6ebf9f0107a59c76a2c510e38f75412d.jpg'),
                mediaType: 1,
                mediaUrl: '',
                sourceUrl: `${arg}`,
                ShowAdAttribution: true,
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
}
module.exports.command = {
    name: 'instagram',
    aliases: ['igdownload', 'igdl', 'ig'],
    category: 'media',
    usage: '[instagram_post_url]',
    exp: 5,
    description: 'Download Instagram content (post, stories, etc.) using the provided API',
};
