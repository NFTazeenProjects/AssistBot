const { reactionEmojis } = require('../../Library/emoji');
module.exports.execute = async (client, flag, arg, M) => {
    if (!arg) {
        return M.reply('❌ *Please provide the name of the song to search the lyrics.*');
    }

    try {
        const term = arg.trim();
        const data = await client.utils.fetch(`https://weeb-api.vercel.app/genius?query=${encodeURIComponent(term)}`);
        
        if (!data.length) {
            return M.reply(`🔍 *Couldn't find any lyrics for "${term}"*`);
        }

        const image = await client.utils.getBuffer(data[0].image);
        const lyrics = await client.utils.fetch(`https://weeb-api.vercel.app/lyrics?url=${data[0].url}`);

        const messageOptions = {
            text: `*Lyrics for "${data[0].title}" by ${data[0].artist}:*\n\n${lyrics}`,
            contextInfo: {
                externalAdReply: {
                    title: `🎶 Title: ${data[0].title}`,
                    body: `🎤 Artist: ${data[0].artist}`,
                    thumbnail: image,
                    mediaType: 1,
                    mediaUrl: data[0].url,
                    sourceUrl: 'https://wa.me/917842346461',
                    ShowAdAttribution: true
                }
            }
        };
        await client.sendMessage(M.from, messageOptions, { quoted: M });
        try {
            const reactionMessage = {
                react: {
                    text: reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)],
                    key: M.key, 
                }
            };
            await client.sendMessage(M.from, reactionMessage, { sendEphemeral: true });
        }
        catch (error) {
            console.error(error);
        }
    }   
    catch (error) {
        console.error('Error in rank:', error);
        return M.reply('❌ *An error occurred while getting your rank. Please try again later.*');
    }
};

module.exports.command = {
    name: 'lyrics',
    aliases: ['ly'],
    category: 'media',
    exp: 50,
    usage: '[text]',
    description: '🎵 Sends the lyrics of a given song',
};
