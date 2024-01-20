const { reactionEmojis } = require('../../Library/emoji');

module.exports.execute = async (client, flag, arg, M) => {
    if (!M.mentions.length) return M.reply(`❌ *Mentions are required to demote*`);

    const mentions = client.utils.removeDuplicates(M.mentions);

    if (mentions.length > 5)
        return M.reply(`❌ *You can only demote up to 5 users at a time. Remove some users and try again*`);

    const groupMetadata = await client.groupMetadata(M.from);
    const groupMembers = groupMetadata?.participants || [];
    const groupAdmins = groupMembers.filter((v) => v.admin).map((v) => v.id);

    let text = `🏅 *_Demote Users..._*\n`;

    for (const jid of mentions) {
        const number = jid.split('@')[0];

        if (!groupAdmins.includes(jid))
            text += `\n🚫 *@${number}* is already not an admin`;
        else {
            await client.groupParticipantsUpdate(M.from, [jid], 'demote');
            text += `\n✅ *Demoted @${number}*`;
        }
    }

    await client.sendMessage(M.from, { text, mentions: M.mentions }, { quoted: M });

    const reactionMessage = {
        react: {
            text: reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)],
            key: M.key,
        }
    };

    await client.sendMessage(M.from, reactionMessage, { sendEphemeral: true });
}

module.exports.command = {
    name: 'demote',
    aliases: ['demo'],
    exp: 5,
    category: 'moderation',
    usage: '[mention user | quote user]',
    description: 'Demotes the tagged user'
};
