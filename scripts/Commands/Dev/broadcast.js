const { reactionEmojis } = require('../../Library/emoji');
module.exports.execute = async (client, flag, arg, M) => {
  if (!arg) {
    return M.reply('❌ *No message provided!*');
  }

  let group = true;
  let results = await client.getAllGroups();

  if (flag.includes('--users')) {
    arg = arg.replace('--users', '');
    group = false;
    results = await client.getAllUsers();
  }

  const MAX_RETRIES = 5;
  const RETRY_DELAY_MS = 2000;

  for (const result of results) {
    const broadcastTitle = '📢 BROADCAST';
    const broadcastMessage = `*${broadcastTitle}*\n\n*Message:*\n${arg}\n\n🚀 *You have received a broadcast from AssistBot!*`;
    const messageOptions = {
      text: broadcastMessage,
      contextInfo: {
        externalAdReply: {
          title: 'Broadcast by AssistBot',
          body: '@AssistBot',
          thumbnail: await client.utils.getBuffer('https://i.pinimg.com/564x/dd/78/ba/dd78bac58c989968fbe27f3878c5631f.jpg'),
          mediaType: 1,
          mediaUrl: '',
          sourceUrl: 'https://chat.whatsapp.com/FvjX39MiPWp0KlPUpGd8mk',
          ShowAdAttribution: true,
        },
      },
    };

    for (let retryCount = 0; retryCount < MAX_RETRIES; retryCount++) {
      try {
        await client.sendMessage(result, messageOptions);
        break; 
      } catch (error) {
        console.error(`Error sending broadcast: ${error.message}`);
        if (retryCount < MAX_RETRIES - 1) {
          console.log(`Retrying in ${RETRY_DELAY_MS / 1000} seconds...`);
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
        } else {
          console.error(`Max retries reached. Unable to send the message.`);
          break;
        }
      }
    }
    try {
      const reactionMessage = {
        react: {
          text: reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)],
          key: M.key,
        }
      };
      await client.sendMessage(M.from, reactionMessage, { sendEphemeral: true });
    } catch (error) {
      console.error(`Error sending reaction: ${error.message}`);
    }
  }

  await M.reply(`📢 *Broadcast sent to ${results.length} ${group ? 'groups' : 'users'}!*`);
};
module.exports.command = {
  name: 'broadcast',
  aliases: ['bc'],
  category: 'dev',
  exp: 0,
  usage: '[message]',
  description: 'Broadcasts a message to all groups or users',
};
