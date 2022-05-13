const { MessageAttachment } = require('discord.js');
const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

function sendMessage(msgObj, message) {
    msgObj.reply(message)
        .then(() => console.log(`Replied to message ${msgObj.content}`))
        .catch(err => console.err);
}

function messageHandler(message) {
    if (message.content.toLowerCase() === 'hello') {
        sendMessage(message, `Hi @${message.author.username}`);
    } else if (message.content.toLowerCase() === 'how are you?') {
        message.react('❤️');
        sendMessage(message, "I'm good! What about you?");
    }
    if (message.author.username === 'Angry〆Mental') {
        console.log(message.author.avatarURL({ 'format': 'png', 'size': 256 }));
        // constructImage(message.author.username);
        // const attachments = new MessageAttachment('./test.png');
        // console.log(attachments);
        // message.channel.send({
        //     files: [attachments],
        //     content: `Hello`
        // });
    }
}

async function fetchAllMessages(channel) {
    let messages = [];

    // Create message pointer
    let message = await channel.messages
        .fetch({ limit: 1 })
        .then(messagePage => (messagePage.size === 1 ? messagePage.at(0) : null));

    while (message) {
        await channel.messages
            .fetch({ limit: 100, before: message.id })
            .then(messagePage => {
                messagePage.forEach(msg => messages.push(msg));

                // Update our message pointer to be last message in page of messages
                message = 0 < messagePage.size ? messagePage.at(messagePage.size - 1) : null;
            })
    }

    console.log(messages.length);  // Print all messages
    return messages;
}

async function deleteMessages(channel, amount) {
    let messages;
    if (amount != 'all')
        messages = await channel.messages.fetch({ limit: amount });
    else
        messages = await fetchAllMessages(channel);


    let { size } = messages;
    if (!size) size = messages.length;
    messages.forEach(msg => msg.delete());
    return size;
}

function handleMemberAdd(member) {
    const channel = member.guild.channels.cache.find(channel => channel.name === 'welcome-and-goodbyes');
    if (!channel) {
        console.log('Channel not found.');
        return;
    }
    const memberName = member.user.username;
    constructImage(memberName);
    const attachments = new MessageAttachment('test.png');

    channel.send({
        files: [attachments],
        content: `Hey ${member}, \nWelcome to **PCN Discord Server**`
    });

}


function constructImage(memberName) {

    const img = loadImage('./img.png').then(
        image => {
            const width = image.width;
            const height = image.height;

            const canvas = createCanvas(width, height);
            const context = canvas.getContext('2d');

            context.font = 'bold 80px Candara';
            context.textAlign = 'left';
            context.textBaseline = 'top';

            context.drawImage(image, 0, 0, width, height);

            const text = memberName;
            console.log(text);
            const textWidth = context.measureText(text).width;
            context.fillStyle = 'tomato';
            context.fillText(text, parseInt((width - textWidth) / 2), 170);

            const buffer = canvas.toBuffer('image/png');
            try {
                fs.writeFileSync('./test.png', buffer);
                console.log("Saved");
                return 0;
            } catch (e) {
                console.log(e);
                return -1;
            }
        }
    );

}

module.exports = { sendMessage, messageHandler, fetchAllMessages, deleteMessages, handleMemberAdd }