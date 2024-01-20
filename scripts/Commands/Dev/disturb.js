const { reactionEmojis } = require('../../Library/emoji');

module.exports.execute = async (client, flag, arg, M) => {
    const groupMetadata = await client.groupMetadata(M.from);
    const groupMembers = groupMetadata?.participants.map((x) => x.id) || [];
    const groupAdmins = groupMetadata.participants.filter((x) => x.admin).map((x) => x.id);

    let text = `📢 *Group Announcement* 📢\n\n`;
    text +=  `${arg !== '' ? `🎇 *Message: ${arg}*\n\n` : ''}`
    text += `🌐 *Group:* ${groupMetadata.subject}\n`;
    text += `👥 *Total Members:* ${groupMetadata.participants.length}\n`;
    text += `👤 *Tagged by:* @${M.sender.split('@')[0]}\n`;

    const admins = [];
    const members = [];

    for (const jid of groupMembers) {
        if (groupAdmins.includes(jid)) {
            admins.push(jid);
        } else {
            members.push(jid);
        }
    }
//=======================================================//
    // text += `\n👑 *Admins:*\n`;                       //
    // for (let i = 0; i < admins.length; i++) {         //
    //     text += `🌟 @${admins[i].split('@')[0]}\n`;   //
    // }                                                 //
    //                                                   //
    // text += `\n👥 *Members:*\n`;                      //
    // for (let i = 0; i < members.length; i++) {        //
    //     text += `👤 @${members[i].split('@')[0]}\n`;  //
    // }                                                 //
//=======================================================//
    await client.sendMessage(M.from, { text, mentions: groupMembers }, { quoted: M });

    const reactionMessage = {
        react: {
            text: reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)],
            key: M.key, 
        }
    };
    await client.sendMessage(M.from, reactionMessage, { sendEphemeral: true });
};

module.exports.command = {
    name: 'disturb',
    aliases: ['dis'],
    exp: 0,
    usage: '[text]',
    category: 'dev',
    description: 'Tag all the members in the group',
};
