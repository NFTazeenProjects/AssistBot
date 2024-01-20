const axios = require('axios');
const { reactionEmojis } = ['😋', '🍲', '🍔', '🥗'];

module.exports.execute = async (client, flag, arg, M) => {
    try {
        const searchQuery = arg || ''; // The argument passed to the command

        const recipeResponse = await axios.get(`http://recipes.eerieemu.com/api/recipe/?page=1&search=${searchQuery}`);

        if (recipeResponse && recipeResponse.data && recipeResponse.data.results && recipeResponse.data.results.length > 0) {
            const recipes = recipeResponse.data.results;
            const recipe = recipes[0]; // Retrieve the first recipe from the results

            const recipeMessage = {
                text: `🍽️ *${recipe.name}*\n\n📜 *Description:*\n${recipe.description || 'No description available'}\n\n📝 *Ingredients:*\n${recipe.ingredients ? recipe.ingredients.join('\n') : 'No ingredients available'}\n\n📋 *Instructions:*\n${recipe.instructions ? recipe.instructions.join('\n') : 'No instructions available'}`,
                contextInfo: {
                    externalAdReply: {
                        title: arg ? `🍽️ ${arg}` : '🍽️ Recipe',
                        body: '@AssistBot',
                        thumbnail: await client.utils.getBuffer(`http://recipes.eerieemu.com${recipe.image_path || ''}`),
                        mediaType: 1,
                        mediaUrl: '',
                        sourceUrl: 'https://chat.whatsapp.com/FvjX39MiPWp0KlPUpGd8mk',
                        ShowAdAttribution: true,
                    },
                },
            };

            await client.sendMessage(M.from, recipeMessage, { quoted: M });

            const reactionMessage = {
                react: {
                    text: reactionEmojis,
                    key: M.key,
                },
            };

            await client.sendMessage(M.from, reactionMessage, { sendEphemeral: true });
        } else {
            return M.reply('No recipes found for this search term.');
        }
    } catch (error) {
        console.error('Error fetching the recipe:', error);
        return M.reply('Error fetching the recipe');
    }
}

module.exports.command = {
    name: 'recipe',
    aliases: ['rsp'],
    exp: 150,
    usage: '<search_term>',
    category: 'education',
    description: 'Get a recipe based on the search term',
};
