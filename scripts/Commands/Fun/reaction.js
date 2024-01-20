module.exports.execute = async (client, flag, arg, M) => {
  try {
    const { reactionEmojis } = require('../../Library/emoji');

    const reactionsPerSecond = 5; // Adjust this value based on your needs
    const interval = 1000 / reactionsPerSecond; // 1000 milliseconds / reactions per second
    const endTime = Date.now() + 60 * 1000; // 1 minute in milliseconds

    while (Date.now() < endTime) {
      if (reactionEmojis && reactionEmojis.length > 0) {
        const reactionMessage = {
          react: {
            text: reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)],
            key: M.key,
          },
        };
        await client.sendMessage(M.from, reactionMessage, { sendEphemeral: true });

        // Introduce a short delay between reactions
        await new Promise(resolve => setTimeout(resolve, interval));
      } else {
        console.error('No reaction emojis found or empty array.');
        break; // Break the loop if there are no emojis to avoid an infinite loop.
      }
    }
  } catch (error) {
    console.error('An error occurred:', error);
    // Handle the error here, log it, or perform necessary actions.
  }
};

module.exports.command = {
  name: 'reaction',
  aliases: ['rs'],
  category: 'fun',
  usage: '',
  exp: 15,
  description: 'Spam reaction emojis in the chat until the user reacts to it',
};
