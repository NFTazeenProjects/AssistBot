const {reactionEmojis} = require('../../Library/emoji');
module.exports.execute = async (client, flag, arg, M) => {
    if (M.quoted?.participant) M.mentions.push(M.quoted.participant)
    if (!M.mentions.length) return M.reply('❌ *Mentions are required to Ban*')
    const mentions = client.utils.removeDuplicates(M.mentions)
    const banned = (await client.DB.get('banned')) || []
    mentions.filter(async (user) =>
        !banned.includes(user)
            ? (await client.DB.push('banned', user)) &&
              (await client.sendMessage(
                  M.from,
                  { text: `🔝 *@${user.split('@')[0]}* is now banned from using the bot`, mentions: [user] },
                  { quoted: M }
              ))
            : await client.sendMessage(
                  M.from,
                  { text: `⚠️ *@${user.split('@')[0]}* is already banned from using the bot`, mentions: [user] },
                  { quoted: M }
              )
    )
    const reactionMessage = {
        react: {
            text: reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)],
            key: M.key, 
        }
    };
    await client.sendMessage(M.from, reactionMessage, { sendEphemeral: true });
}

module.exports.command = {
    name: 'ban',
    aliases: ['ban'],
    exp: 0,
    category: 'dev',
    usage: '[mention user | quote user]',
    description: 'Bans the taged user'
}
