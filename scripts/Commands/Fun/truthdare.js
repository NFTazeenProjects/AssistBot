const truths = [
  "What's the most adventurous thing you've ever done?",
  'Have you ever kept a major secret from your best friend?',
  'What’s the most embarrassing thing your parents have caught you doing?',
  'If you could switch lives with someone for a day, who would it be and why?',
  'What’s your biggest regret in a relationship?',
  'Have you ever had a crush on a friend’s significant other?',
  'What’s the silliest lie you’ve ever told to get out of trouble?',
  'What’s the most trouble you got into as a kid?',
  'What’s a skill you wish you had?',
  'Have you ever ghosted someone, and why?',
  'What’s the weirdest dream you’ve ever had?',
  'What’s the most rebellious thing you’ve done?',
  'What’s your most irrational fear?',
  'Have you ever eavesdropped on someone else’s conversation?',
  'What’s the most impulsive purchase you’ve ever made?',
  'What’s the most ridiculous thing you’ve done while bored?',
  'What’s the most embarrassing thing you’ve Googled?',
  'Have you ever had a crush on a teacher?',
  'What’s a hidden talent you possess?',
  'What’s the most embarrassing thing you’ve worn in public?',
  'What’s the biggest misconception people have about you?',
  'What’s the weirdest food combination you enjoy?',
  'Have you ever pretended to laugh at a joke you didn’t get?',
  'What’s the most childish thing you still do as an adult?',
  'What’s the most embarrassing nickname you’ve had?',
  'Have you ever cried during a movie? If so, which one?',
  'What’s your most irrational pet peeve?',
  'What’s the most trouble you’ve gotten into at school?',
  'What’s the most daring thing you’ve done in front of a crowd?',
  'Have you ever had a falling out with a close friend?',
  'What’s the most embarrassing thing you’ve posted on social media?',
  'What’s the craziest thing you’ve done for someone you were attracted to?',
  'What’s a weird habit you have that you’re not willing to change?',
  'Have you ever faked being sick to get out of something?',
  'What’s the most embarrassing thing you’ve said to your crush?',
  'What’s the most embarrassing thing you’ve done for love?',
  'What’s the most ridiculous excuse you’ve used to avoid a situation?',
  'Have you ever accidentally sent a text to the wrong person? What did it say?',
  'What’s the most awkward date experience you’ve had?',
  'What’s the silliest thing you believed as a child?',
  "What’s the most absurd conspiracy theory you've believed for a while?",
  'Have you ever accidentally injured yourself doing something stupid?',
  'What’s the most embarrassing thing that’s happened to you during a family gathering?',
  'What’s the most embarrassing thing you did to impress someone?',
  'What’s the most bizarre encounter you’ve had with a stranger?',
  'What’s the most embarrassing thing you’ve done in an elevator?',
  'Have you ever walked into a glass door?'
];


const dares = [
  'Sing a song in a public place.',
  'Do a five-minute stand-up comedy routine.',
  'Speak in an accent for the next 10 minutes.',
  'Do the worm dance in the middle of a room.',
  'Go outside and howl at the moon.',
  'Make a prank call to a friend.',
  'Do 20 push-ups.',
  'Wear your clothes backward for the next hour.',
  'Give a stranger a high-five.',
  'Strike up a conversation with a random person in a public place.',
  'Send a silly selfie to the fifth person in your contact list.',
  'Try a food combination that sounds weird to you.',
  'Do an interpretive dance to a random song.',
  'Wear a funny hat for the next hour.',
  'Tell a joke to a stranger.',
  'Take a video of yourself doing the chicken dance.',
  'Speak only in rhymes for the next 10 minutes.',
  'Wear a sign that says "Free Hugs" for 15 minutes.',
  'Do a handstand for as long as you can.',
  'Take a picture with a random object in a public place.',
  'Write and perform a short rap about a random object in the room.',
  'Try to break a world record in something silly.',
  'Draw a funny face on your stomach and show it to everyone.',
  'Make a short video of yourself dancing to a random song and post it on social media.',
  'Pretend to be a news anchor and report on a made-up story.',
  'Try to juggle three random objects for a minute.',
  'Make a sandwich blindfolded.',
  'Do a dramatic reading of a nursery rhyme.',
  'Ask a stranger for a piggyback ride.',
  'Find a street performer and join their act for a minute.',
  'Dress up in a costume and take a selfie in a public place.',
  'Do an impression of a famous person.',
  'Challenge someone to a thumb war.',
  'Find a karaoke machine and sing a random song.',
  'Act out a scene from a movie in public.',
  'Do a cartwheel in a public place.',
  'Start a dance party in a public place.',
  'Make a human pyramid with friends.',
  'Do a silly walk for the next 5 minutes.',
  'Tell a joke to a cashier or server.',
  'Find a street sign with a funny name and take a picture with it.',
  'Do a freestyle rap about something in the room.',
  'Start a conga line in a public place.',
  'Do the Macarena or the Chicken Dance in a crowded area.',
  'Strike a pose like a famous statue in a public place.',
  'Do a TikTok dance challenge.'
];


const { reactionEmojis } = require('../../Library/emoji');

module.exports.execute = async (client, flag, arg, M) => {
  if (!arg) {
    return M.reply("To use the truth dare command, type `!td truth` for a truth or `!td dare` for a dare.");
  }

  let randomPrompt;
  let promptType;

  if (arg && arg.toLowerCase() === 'truth') {
    promptType = 'Truth';
    randomPrompt = truths[Math.floor(Math.random() * truths.length)];
  } else if (arg && arg.toLowerCase() === 'dare') {
    promptType = 'Dare';
    randomPrompt = dares[Math.floor(Math.random() * dares.length)];
  } else {
    return M.reply("To use the truth dare command, type `!td truth` for a truth or `!td dare` for a dare.");
  }

  const promptMessage = {
    text: `📜 *${promptType}:*\n\n${randomPrompt}`,
    contextInfo: {
      externalAdReply: {
        title: 'Truth or Dare',
        body: '',
        thumbnail: await client.utils.getBuffer('https://i.pinimg.com/564x/a2/6a/27/a26a27a5ff6a2cb80d5b872a73d1413b.jpg'),
        mediaType: 1,
        mediaUrl: '',
        sourceUrl: 'https://chat.whatsapp.com/FvjX39MiPWp0KlPUpGd8mk',
        ShowAdAttribution: true,
      },
    },
  };

  await client.sendMessage(M.from, promptMessage, { quoted: M });

  const reactionMessage = {
    react: {
        text: reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)],
        key: M.key,
    }
  };
  await client.sendMessage(M.from, reactionMessage, { sendEphemeral: true });

  return;
} 




module.exports.command = {
  name: 'truthdare',
  aliases: ['td'],
  category: 'fun',
  usage: 'truthdare [truth|dare]',
  exp: 15,
  description: 'Get a random truth or dare prompt.',
};
