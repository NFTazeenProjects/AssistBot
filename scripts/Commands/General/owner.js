const {reactionEmojis} = require('../../Library/emoji');
module.exports.execute = async (client, flag, arg, M) => {
    try {
        const audioUrl = 'https://github.com/well300/simple-quiz-game/raw/main/River%20flows%20in%20you%20Yiruma%20%20piano.mp3';
        const audioBuffer = await client.utils.getBuffer(audioUrl);

        const messageOptions = {
            audio: audioBuffer,
            mimetype: 'audio/mpeg',
            ptt: false,
            fileName: "well300",
            contextInfo: {
                externalAdReply: {
                    mentionedJid: [M.se], 
                    title: "👤 Tap here to get the owner's contact",
                    body: 'well300',
                    thumbnail: await client.utils.getBuffer('https://i.pinimg.com/564x/21/f9/44/21f9446aebcb382791c4f6613adc413d.jpg'),
                    mediaType: 0,
                    mediaUrl: audioUrl,
                    sourceUrl: 'https://wa.me/917842346461',
                    ShowAdAttribution: true,
                }
            }
        };
        await client.sendMessage(M.from, messageOptions, { quoted: M });
    } catch (err) {
        console.error('❌ An error occurred while downloading and sending the audio:', err);
    }
    const reactionMessage = {
        react: {
            text: reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)],
            key: M.key, 
        }
    };
    await client.sendMessage(M.from, reactionMessage, { sendEphemeral: true });
    return;
};

module.exports.command = {
    name: 'owner',
    aliases: ['mod', 'moderator', 'owner'],
    category: 'general',
    usage: '| [cmd]',
    exp: 10,
    description: '👤 Get the contact of the owner',
};
