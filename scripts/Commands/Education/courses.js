const { coursesList, getCoursesByCategory } = require('../../Library/courses');
const { reactionEmojis } = require('../../Library/emoji');

module.exports.execute = async (client, flag, arg, M) => {
    if (!arg) {
        const topics = Array.from(new Set(coursesList.map(course => course.category))).join('\n');
        const topicsWithEmojis = coursesList.map(course => `🔹 ${course.category}`).join('\n');
        const responseMessage = `📖 *Available Topics:*\n\n${topicsWithEmojis}\n\n--------------------------------\n📝✏️ *Note:* Type \`${client.config.prefix}courses <topics_name>\` to get details for a specific topic's course.\n\n*by AssistBots*`;
        
        const messageOptions = {
            text: responseMessage,
            contextInfo: {
                externalAdReply: {
                    title: '📚 AssistBot Courses',
                    body: '@assistBot',
                    thumbnail: await client.utils.getBuffer('https://i.pinimg.com/564x/a2/6a/27/a26a27a5ff6a2cb80d5b872a73d1413b.jpg'),
                    mediaType: 1,
                    mediaUrl: '',
                    sourceUrl: 'https://chat.whatsapp.com/FvjX39MiPWp0KlPUpGd8mk',
                    ShowAdAttribution: true,
                },
            },
        };

        return client.sendMessage(M.from, messageOptions, { quoted: M });
    }

    const courseCategory = arg.toLowerCase(); // Transform the user input to lowercase for consistency

    const selectedCourses = coursesList.filter(course =>
      course.category.toLowerCase() === courseCategory
    );
    
    if (selectedCourses.length === 0) {
      return M.reply('❌ No courses found for the given category.\n\n*by AssistBot*');
    }
    

    const coursesString = selectedCourses.map((course, index) => {
        return `*${course.name}*\n${course.content}\n🔗 ${course.downloadLink}\n`;
    }).join('\n') + `--------------------------------\n📝✏️ *Note:* Type \`${client.config.prefix}courses <topics_name>\` to get details for a specific topic\'s course.\n\n*by AssistBots*`;

    const responseMessage = `*📚${courseCategory}*\n\n${coursesString}\n`;

    const messageOptions = {
        text: responseMessage,
        contextInfo: {
            externalAdReply: {
                title: '📚 AssistBot Courses',
                body: '',
                thumbnail: await client.utils.getBuffer('https://i.pinimg.com/564x/a2/6a/27/a26a27a5ff6a2cb80d5b872a73d1413b.jpg'),
                mediaType: 1,
                mediaUrl: '',
                sourceUrl: 'https://chat.whatsapp.com/FvjX39MiPWp0KlPUpGd8mk',
                ShowAdAttribution: true,
            },
        },
    };

    await client.sendMessage(M.from, messageOptions, { quoted: M });

    const reactionMessage = {
        react: {
            text: reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)],
            key: M.key,
        },
    };

    await client.sendMessage(M.from, reactionMessage, { sendEphemeral: true });
};

module.exports.command = {
    name: 'courses',
    aliases: ['cs'],
    exp: 150,
    usage: '[course_number]',
    category: 'education',
    description: 'Shows all available courses and details for the selected course',
    // admin: false,
    // botadmin: false
};
