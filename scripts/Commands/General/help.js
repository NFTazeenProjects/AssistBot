const categories = [
    { id: 'dev', font: 'Dev', emojis: ['👨‍💻', '📁', '👨‍🔧'] },
    { id: 'general', font: 'General', emojis: ['📋', '📁', '📄'] },
    { id: 'education', font: 'Education', emojis: ['📚', '📖', '📓'] },
    { id: 'music', font: 'Music', emojis: ['🎵', '🎶', '🎼'] },
    { id: 'moderation', font: 'Moderation', emojis: ['🔨', '🔧', '🔩'] },
    { id: 'news', font: 'News', emojis: ['📰', '📑', '📄'] },
    { id: 'fun', font: 'Fun', emojis: ['🎭', '🎉', '🎊'] },
    { id: 'media', font: 'Media', emojis: ['🎥', '📷', '🎼'] },
    { id: 'games', font: 'Games', emojis: ['🎮', '🕹️', '🎲'] },
    { id: 'utils', font: 'Utils', emojis: ['🔧', '🔨', '🔩'] },
];
const {reactionEmojis} = require('../../Library/emoji');
module.exports.execute = async (client, flag, arg, M) => {
    if (!arg) {
        const commandCategories = {};

        client.cmd.forEach((item) => {
            if (commandCategories[item.command.category]) {
                commandCategories[item.command.category].push(item.command.name);
            } else {
                commandCategories[item.command.category] = [item.command.name];
            }
        });

        

        let helpText =
            `👋 *Hello, ${M.pushName} 🍃!* This help menu will guide you on how to use the bot.\n\n` +
            `📜 *Command Categories*:\n`;

        for (const category of categories) {
            if (commandCategories[category.id]) {
                const randomEmoji = category.emojis[Math.floor(Math.random() * category.emojis.length)];
                helpText += `\n${randomEmoji} *${category.font}:*\n` +
                    `\`\`\`${commandCategories[category.id].join(', ')}\`\`\`\n`;
            }
        }

        helpText += `\n📝 *Note* 📝: Use \`${client.config.prefix}help <command name>\` from the list to see the description and usage.`;

        const messageOptions = {
            text: helpText,
            contextInfo: {
                externalAdReply: {
                    title: '📚 AssistBot Help Menu',
                    body: '@AssistBot',
                    thumbnail: await client.utils.getBuffer('https://i.pinimg.com/564x/9c/0e/0d/9c0e0dd771694462ee394e8bfbe29869.jpg'),
                    mediaType: 1,
                    mediaUrl: '',
                    sourceUrl: 'https://chat.whatsapp.com/FvjX39MiPWp0KlPUpGd8mk',
                    ShowAdAttribution: true,
                },
            },
        };

        await client.sendMessage(M.from, messageOptions, { quoted: M });
    }
    else {
        const command = client.cmd.find((cmd) => cmd.command.name === arg.toLowerCase() || cmd.command.aliases.includes(arg.toLowerCase()));
        if (!command) {
            return M.reply(`❌ *Sorry, I could not find any command with the name "${arg}"*`);
        }
        const commandCategory = categories.find((cat) => cat.id === command.command.category);
        const categoryEmojis = commandCategory ? commandCategory.emojis.join(' ') : '';
        const commandHelp = `*📝 Command Information*\n\n` +
            `📌 *Name:* ${command.command.name}\n` +
            `🔶 *Category:* ${command.command.category} ${categoryEmojis}\n` +
            `💡 *Experience:* ${command.command.exp}\n` +
            `👑 *Admin Required:* ${command.command.category === 'moderation' ? 'Yes' : 'No'}\n` +
            `🔄 *Aliases:* ${command.command.aliases.join(', ')}\n` +
            `🔍 *Usage:* ${client.config.prefix}${command.command.name} ${command.command.usage}\n` +
            `📄 *Description:* ${command.command.description}`;
        const messageOptions = {
            text: commandHelp,
            contextInfo: {
                externalAdReply: {
                    title: '📚 AssistBot Help Menu',
                    body: '',
                    thumbnail: await client.utils.getBuffer('https://i.pinimg.com/564x/9c/0e/0d/9c0e0dd771694462ee394e8bfbe29869.jpg'),
                    mediaType: 1,
                    mediaUrl: '',
                    sourceUrl: 'https://chat.whatsapp.com/FvjX39MiPWp0KlPUpGd8mk',
                    ShowAdAttribution: true,
                },
            },
        };

        await client.sendMessage(M.from, messageOptions, { quoted: M });
    }
    const reactionMessage = {
        react: {
            text: reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)],
            key: M.key,
        }
    };
    await client.sendMessage(M.from, reactionMessage, { sendEphemeral: true });
    return;
};

module.exports.command = {
    name: 'help',
    aliases: ['h', 'menu', 'list', 'commands'],
    category: 'general',
    usage: '| [cmd]',
    exp: 10,
    description: '📚 Allows you to view the list of available commands',
};
