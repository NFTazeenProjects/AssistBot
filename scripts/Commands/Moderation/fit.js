const axios = require('axios');
const { reactionEmojis } = require('../../Library/emoji');

const settings = [
    {
        name: 'mods',
        description: 'Enables the bot to remove members who send invite links to other groups (requires bot admin privileges). 🛡️',
    },
    {
        name: 'events',
        description: 'If enabled, the bot will listen for group events like new members joining, leaving, etc. 📅',
    },
    {
        name: 'chatbot',
        description: 'Automatically participate in chat if enabled. 🤖',
    },
    {
        name: 'invitelink',
        description: 'Allow access to the invitelink command if enabled. 🔗',
    }
];

// Function to get the status of a setting
const getSettingStatus = async (client, settingName, M) => {
    const isActive = (await client.DB.get(settingName)) && (await client.DB.get(settingName)).includes(M.from);
    return isActive ? '(Enabled)' : '(Disabled)';
};

module.exports.execute = async (client, flag, arg, M) => {
    const option = ['--on', '--off'];

    if (!option.includes(flag[0])) {
        const settingStatusPromises = settings.map(async ({ name, description }) => {
            const status = await getSettingStatus(client, name, M);
            const emoji = status.includes('(Enabled)') ? '✅' : '❌';
            return `${emoji} *${name}:* ${description}\n*Status: ${status}*\n--------------------------------`;
        });

        // Add the reaction code here
        const reactionMessage = {
            react: {
                text: reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)],
                key: M.key, 
            }
        };
        await client.sendMessage(M.from, reactionMessage, { sendEphemeral: true });
        
        const settingStatusMessages = await Promise.all(settingStatusPromises);
        // Add the provided messageOptions code
        const messageOptions = {
            text: `📜 *Settings:*\n\n${settingStatusMessages.join('\n')}\n\n📝 *Note 📓:* Use \`${client.config.prefix}fit <option> --on | --off\` to change the settings.`, // Replace with the response
            contextInfo: {
                externalAdReply: {
                    title: 'Assist Bot Settings', // Updated title
                    body: '@AssistBot',
                    thumbnail: await client.utils.getBuffer('https://i.pinimg.com/564x/3d/90/83/3d9083502a5794811084f5c754104a48.jpg'),
                    mediaType: 1,
                    mediaUrl: '',
                    sourceUrl: 'https://chat.whatsapp.com/FvjX39MiPWp0KlPUpGd8mk',
                    ShowAdAttribution: true,
                },
            },
        };
        await client.sendMessage(M.from, messageOptions, { quoted: M });

        return;
    }

    if (!settings.map((x) => x.name).includes(arg)) return M.reply(`🛑 *Invalid setting*`);

    const Actives = (await client.DB.get(arg)) || [];

    if (flag[0] === '--on') {
        if (Actives.includes(M.from)) return M.reply(`✅ *${client.utils.capitalize(arg)} is already enabled*`);
        await client.DB.push(arg, M.from);
        return M.reply(`🟩 *Enabled "${client.utils.capitalize(arg)}"*`);
    }

    if (flag[0] === '--off') {
        if (!Actives.includes(M.from)) return M.reply(`✅ *${client.utils.capitalize(arg)} is already disabled*`);
        await client.DB.pull(arg, M.from);
        return M.reply(`🔴 *Disabled "${client.utils.capitalize(arg)}"*`);
    }

    return M.reply(`🛑 *Invalid value*`);
};

module.exports.command = {
    name: 'fit',
    aliases: ['fit'],
    exp: 10,
    category: 'moderation',
    usage: '[option] --on | --off',
    description: 'Activate certain features in group chats',
};
