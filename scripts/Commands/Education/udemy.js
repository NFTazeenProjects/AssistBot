const { reactionEmojis } = require('../../Library/emoji');
const axios = require('axios');

module.exports.execute = async (client, flag, arg, M) => {
  const apiUrl = "https://udemybot-api.vercel.app/json";
  const pollingInterval = 5000; // ⏳ 5 seconds (adjust as needed)

  let courses = []; // 📚 Change from const to let

  const initialResponse = {
    text: "Please wait. The course is being generated from the server. ⌛",
  };
  await client.sendMessage(M.from, initialResponse, { quoted: M });

  let isDataAvailable = false;

  while (true) {
    try {
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (Array.isArray(data)) {
        // Assuming the data is an array of courses in the format you provided
        courses = data;

        isDataAvailable = true;
        break; // Exit the loop when data is available
      } else {
        // Data is not available, continue polling
        await new Promise((resolve) => setTimeout(resolve, pollingInterval));
      }
    } catch (error) {
      console.error("Error fetching data from API:", error.message);
      // Handle the error, and you might consider adding more specific error checks
      await new Promise((resolve) => setTimeout(resolve, pollingInterval));
    }
  }

  if (isDataAvailable) {
    const courseText = courses.map((course, index) => {
      return `*${index + 1}. ${course.title}*\n${course.coupon}\n${'-'.repeat(30)}`;
    }).join('\n\n');

    const messageOptions = {
      text: `📤 *Available Courses:*\n${courseText}\n\n👉 *By @AssistBot*`,
      contextInfo: {
        externalAdReply: {
          title: '📚 Udemy course',
          body: '@AssistBot',
          thumbnail: await client.utils.getBuffer('https://i.pinimg.com/564x/e8/55/cd/e855cdf1ed75bdd5d086faeb42a43c8c.jpg'),
          mediaType: 1,
          mediaUrl: '',
          sourceUrl: 'https://chat.whatsapp.com/FvjX39MiPWp0KlPUpGd8mk',
          ShowAdAttribution: true,
        },
      }
    };
    await client.sendMessage(M.from, messageOptions, { quoted: M });
  } else {
    const errorMessage = {
      text: "Sorry, the server is not responding. Please try again later. ⚠️",
    };
    await client.sendMessage(M.from, errorMessage, { quoted: M });
  }

  const reactionMessage = {
    react: {
      text: reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)],
      key: M.key,
    }
  };
  await client.sendMessage(M.from, reactionMessage, { sendEphemeral: true });
};

module.exports.command = {
  name: 'udemy',
  aliases: ['ubot', 'ub'],
  category: 'education',
  usage: '[text]',
  exp: 10,
  description: 'Gives the links of the Udemy course 📦',
};
