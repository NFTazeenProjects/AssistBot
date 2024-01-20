const axios = require('axios');
const { reactionEmojis } = require('../../Library/emoji');

module.exports.execute = async (client, flag, arg, M) => {
    if (!arg) {
        return M.reply('❌ *Sorry, you did not provide any term!*');
    }

    try {
        let customReply = '';

        switch (arg.toLowerCase()) {
            case 'who is the owner of this bot':
                customReply = 'The owner of this bot is well300.';
                break;
            case 'what can you do':
                customReply = 'I can answer questions, provide information, and assist with various tasks.';
                break;
            // Add more cases for other custom responses here
            default:
                customReply = ''; // No custom reply for this query
        }

        if (customReply) {
            const messageOptions = {
                text: `📚 *ChatGPT FREE AI*\n\n` +
                `*AI Response:* ${customReply}`,
                contextInfo: {
                    externalAdReply: {
                        title: "👤 Tap here to get the owner's contact",
                        body: 'well300',
                        thumbnail: await client.utils.getBuffer('https://i.pinimg.com/564x/21/f9/44/21f9446aebcb382791c4f6613adc413d.jpg'),
                        mediaType: 0,
                        mediaUrl: '',
                        sourceUrl: 'https://wa.me/917842346461',
                        ShowAdAttribution: true,
                    },
                },
            };
            await client.sendMessage(M.from, messageOptions, { quoted: M });

            // If a custom reply is sent, skip the AI response
            return;
        }

        // If no custom reply is found, proceed with the AI response
        const response = await axios.get(`https://www.guruapi.tech/api/chatgpt?text=${encodeURIComponent(arg)}`);

        let responseGpt = `📚 *ChatGPT FREE AI*\n\n` +
            `*AI Response:* ${response.data.result}`;

        const messageOptions = {
            text: responseGpt,
            contextInfo: {
                externalAdReply: {
                    title: `AI Assistance`,
                    body: 'Need help? Reach out!',
                    thumbnail: await client.utils.getBuffer(
                        'https://i.pinimg.com/564x/26/b7/3d/26b73d86e9a28750c212aec76c8a6957.jpg'
                    ),
                    mediaType: 0,
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
    } catch (error) {
        console.error('Error in ChatGPT:', error);
        return M.reply('❌ *An error occurred while using ChatGPT. Please try again later.*');
    }
};

module.exports.command = {
    name: 'gpt',
    aliases: ['g', 'ai', 'chatgpt'],
    category: 'education',
    usage: '[term]',
    exp: 5,
    description: '🤖 Let you chat with a GPT chat bot'
};
