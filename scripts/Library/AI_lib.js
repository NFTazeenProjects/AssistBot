const api = require('api')('@writesonic/v2.2#4enbxztlcbti48j');
api.auth(process.env.WRITE_SONIC);

/**
 * Generate content using the WriteSonic API.
 * @param {string} text - The input text for content generation.
 * @returns {Promise<object>} - An object containing the response.
 */
const WriteSonic_gpt = async (text) => {
    try {
        const result = await api.chatsonic_V2BusinessContentChatsonic_post(
            {
                enable_google_results: 'true',
                enable_memory: true,
                input_text: text
            },
            { engine: 'premium' }
        );

        return {
            response: result
        };
    } catch (error) {
        return {
            error: 'Failed',
            errorMessage: error.message
        };
    }
};

module.exports = {
    WriteSonic_gpt
};
