const Welcomer = require('welcomer-gif');

module.exports = async function EventsHandler(event, client) {
    const activateEvents = (await client.DB.get('events')) || [];
    const groupMetadata = await client.groupMetadata(event.id);
    if (!activateEvents.includes(event.id)) return;
    const text =
        event.action === 'add'
            ? `- ${groupMetadata.subject} -\n\n📌 *Group Description:*\n${groupMetadata.desc}\n\nWelcome to the group, hope you follow the rules and have fun!\n\n*Members added: ${event.participants
                  .map((jid) => `@${jid.split('@')[0]}`)
                  .join(', ')}* 👋`
            : event.action === 'remove'
            ? `Goodbye *${event.participants
                  .map((jid) => `@${jid.split('@')[0]}`)
                  .join(', ')}* 👋, we won't miss you.`
            : event.action === 'demote'
            ? `Oh no, looks like *@${event.participants[0].split('@')[0]}* got demoted.`
            : `Congratulations *@${event.participants[0].split('@')[0]}* for being promoted! 🎉`;

    if (event.action === 'add') {
        const user = event.participants[0];
        const username = (await client.contact.getContact(user, client)).username;
        const tag = ((Math.random() * 10000) | 0).toString().padStart(4, '0');
        let imageUrl;

        try {
            imageUrl = await client.profilePictureUrl(user, 'image');
        } catch {
            imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg';
        }

        const pfp = await client.utils.getBuffer(imageUrl);
        const image = new Welcomer()
            .setBackground('https://i.pinimg.com/originals/6a/8e/4d/6a8e4d2b450f10d3733422efc4e95526.gif')
            .setGIF(true)
            .setAvatar(pfp)
            .setName(username)
            .setDiscriminator(tag);

        return void (await client.sendMessage(event.id, {
            video: await client.utils.gifToMp4(await image.generate()),
            gifPlayback: true,
            mentions: event.participants,
            caption: text
        }));
    }

    client.sendMessage(event.id, {
        text,
        mentions: event.participants
    });
}