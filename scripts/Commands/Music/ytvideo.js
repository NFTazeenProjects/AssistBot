const YT = require('../../Library/YT');
const yts = require('yt-search');

module.exports.execute = async (client, flag, arg, M) => {
    const link = async (term) => {
        const { videos } = await yts(term.trim());
        if (!videos || videos.length === 0) return null;
        return videos[0].url;
    }

    if (!arg) return M.reply('❌ *Please use this command with a valid youtube.com link*');

    const validPathDomains = /^https?:\/\/(youtu\.be\/|(www\.)?youtube\.com\/(embed|v|shorts)\/)/;
    const term = validPathDomains.test(arg) ? arg.trim() : await link(arg);

    if (!term) return M.reply('⚠️ *Please use this command with a valid youtube content term*');
    if (!YT.validateURL(term.trim())) return M.reply('⚠️ *Please use this command with a valid youtube.com link*');
    
    try {
        const { videoDetails } = await YT.getInfo(term);
        const videoBuffer = await YT.getBuffer(term, 'video');
        const thumbnailURL = `https://i.ytimg.com/vi/${videoDetails.videoId}/maxresdefault.jpg`;

        const messageOptions = {
            document: videoBuffer,
            mimetype: 'video/mp4',
            fileName: `${videoDetails.title}.mp4`,
            caption: `⚡ *Title: ${videoDetails.title}*\n🎤 *Author: ${videoDetails.author.name}*\n🚀 *Views: ${videoDetails.viewCount}*\n🎞 *Type: Video*\n`,
            contextInfo: {
                externalAdReply: {
                    title: `🎵 ${videoDetails.title}`,
                    body: `🎤 ${videoDetails.author.name}`,
                    thumbnail: await client.utils.getBuffer(thumbnailURL),
                    mediaType: 1,
                    mediaUrl: '',
                    sourceUrl: `${videoDetails.video_url}`,
                    ShowAdAttribution: true,
                }
            }
        };
        

        await client.sendMessage(M.from, messageOptions, { quoted: M })
        try {
            const reactionMessage = {
                react: {
                    text: reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)],
                    key: M.key
                }
            }
            await client.sendMessage(M.from, reactionMessage, { sendEphemeral: true })
        } catch (error) {
            console.error(error)
        }
    } catch (error) {
        console.error('Error in rank:', error)
        return M.reply('❌ *An error occurred while getting your rank. Please try again later.*')
    }
}


module.exports.command = {
    name: 'ytvideo',
    aliases: ['ytv'],
    category: 'media',
    usage: '[term | link]',
    exp: 5,
    description: 'Downloads and sends the given YT Video'
};
