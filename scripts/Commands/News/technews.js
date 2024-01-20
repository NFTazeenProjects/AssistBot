const axios = require('axios');

module.exports.execute = async (client, flag, arg, M) => {
    const apiKey = 'b7992e6c8c2040c6870a107d2f8236c3';
    try {
        const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=${apiKey}`);

        if (response.status === 200) {
            const articles = response.data.articles;

            // Create a single message to store all news articles
            let messageText = '';

            // Iterate through the articles and append each article's information to the messageText
            for (const article of articles) {
                messageText += `📰 *${article.title}*\n\n` +
                    `*Description:* ${article.description || 'No description available.'}\n` + // Handle missing description
                    `*Content:* ${article.content || 'No content available.'}\n` + // Handle missing content
                    `*Read more:* ${article.url}\n\n----------------------------\n`;
            }

            // Check if there are articles
            if (messageText.trim() === '') {
                return M.reply('❌ *No articles found.*');
            }

            const messageOptions = {
                text: messageText,
                contextInfo: {
                    externalAdReply: {
                        title: `📰 AssistBot || Tech News`,
                        body: `📰 Latest News`,
                        thumbnail: await client.utils.getBuffer('https://i.pinimg.com/564x/b2/a7/8b/b2a78b7520577fc3664213e22bffd2c3.jpg'),
                        mediaType: 1,
                        mediaUrl: '', // Set media URL to the specified image
                        sourceUrl: 'https://chat.whatsapp.com/FvjX39MiPWp0KlPUpGd8mk',
                        showAdAttribution: true, 
                        attributionText: 'Powered by AssistBot News', 
                        
                    },
                },
            };

            // Send the combined message with all news articles
            await client.sendMessage(M.from, messageOptions, { quoted: M });
        } else {
            console.error('News API request failed with status code:', response.status);
            return M.reply('❌ *An error occurred while getting the news. Please try again later.*');
        }
    } catch (error) {
        console.error('Error in News:', error);
        return M.reply('❌ *An error occurred while getting the news. Please try again later.*');
    }
};

module.exports.command = {
    name: 'technews',
    aliases: ['tns'],
    exp: 0,
    usage: '',
    category: 'news',
    description: 'Get live top and breaking technology headlines from India',
};
