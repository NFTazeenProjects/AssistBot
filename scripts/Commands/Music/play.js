const YT = require('../../Library/YT');
const yts = require('yt-search');
const { reactionEmojis } = require('../../Library/emoji');

module.exports.execute = async (client, flag, arg, M) => {
    const defaultThumbnailURL = 'https://i.pinimg.com/564x/92/f5/78/92f578f10d352a63e7264133aa7f9807.jpg';

    async function fetchThumbnail(url) {
        try {
            return await client.utils.getBuffer(url);
        } catch (error) {
            console.error('Error fetching thumbnail:', error);
            return null;
        }
    }

    if (!arg) {
        M.reply('❌ Please use this command with a valid YouTube link or search term.');
        return;
    }

    const validPathDomains = /^https?:\/\/(youtu\.be\/|(www\.)?youtube\.com\/(embed|v|shorts)\/)/;
    const term = arg.trim().match(validPathDomains) ? arg.trim() : (await yts(arg.trim())).videos[0].url;

    if (!term) {
        M.reply('⚠️ No YouTube video found for the given term or link.');
        return;
    }

    if (!YT.validateURL(term.trim())) {
        M.reply('⚠️ Please use this command with a valid youtube.com link.');
        return;
    }

    try {
        const { videoDetails } = await YT.getInfo(term);
        const audioBufferAAC = await YT.getBuffer(term, 'audio', 'aac'); 
        const audioBufferMP3 = await YT.getBuffer(term, 'audio', 'mp3'); 

        const thumbnail = await fetchThumbnail(videoDetails.thumbnails[0].url).catch(() => null);

        const messageOptions = {
            audio: audioBufferAAC, 
            mimetype: 'audio/aac',
            ptt: false,
            fileName: `${videoDetails.title}.aac`, 
            contextInfo: {
                externalAdReply: {
                    title: `🎵 ${videoDetails.title}`,
                    body: `🎤${videoDetails.author.name}`,
                    thumbnail: thumbnail || (await fetchThumbnail(defaultThumbnailURL).catch(() => null)),
                    mediaType: 1,
                    mediaUrl: '',
                    sourceUrl: `${videoDetails.video_url}`,
                    ShowAdAttribution: true
                }
            }
        };
        if (M.isAndroid) {
            messageOptions.audio = audioBufferMP3;
            messageOptions.mimetype = 'audio/mpeg';
            messageOptions.fileName = `${videoDetails.title}.mp3`;
        }

        await client.sendMessage(M.from, messageOptions, { quoted: M });

        try {
            const reactionMessage = {
                react: {
                    text: reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)],
                    key: M.key
                }
            };
            await client.sendMessage(M.from, reactionMessage, { sendEphemeral: true });
        }
        catch (error) {
            console.error(error);
        }

        return;
    }
    catch (error) {
        console.error('Error in rank:', error);
        return M.reply('❌ *An error occurred while getting your rank. Please try again later.*');
    }
};

module.exports.command = {
    name: 'play',
    aliases: ['yta', 'play'],
    category: 'media',
    usage: '[term | link]',
    exp: 5,
    description: '🎧 Downloads a YouTube video and sends it as Audio'
};
