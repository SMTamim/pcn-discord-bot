const { MessageAttachment } = require('discord.js');
const fs = require('fs');
const { registerFont, createCanvas, loadImage } = require('canvas');

const colors = ['#00FFFF', '#800080', '#FF00FF', '#fff', '#FFFF00', '#00FF00', '#FFA500',];

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
    if (message.author.username === 'Angry〆Mental' || message.author.username === '!    HiddenFigure🔆') {
        //console.log(message.author.avatarURL({ 'format': 'png', 'size': 256 }));
        constructImageAndSend(message.author, message.channel);

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
    // console.log(member.user);
    constructImageAndSend(member.user, channel);

}

function handleMemberRemove(member) {
    const channel = member.guild.channels.cache.find(channel => channel.name === 'welcome-and-goodbyes');
    if (!channel) {
        console.log('Channel not found.');
        return;
    }
    // console.log(member.user);
    constructImageAndSend(member.user, channel, 'Goodbye', 'We\'ll mis you 😥');
}


async function constructImageAndSend(memberObj, channel, upper = "Welcome", tagline = "Have a great journey!") {
    const banners = fs.readdirSync('./assets/images/wc-banner').filter(file => file.endsWith('.png'));
    const selectedImage = banners[parseInt(Math.random() * banners.length)];

    console.log(banners, parseInt(Math.random() * banners.length));

    const img = loadImage(`./assets/images/wc-banner/${selectedImage}`).then(image => {

        let avatarURL = 'https://siteforsuccess.com/JS/pcn_images/discord.jpg';
        if (memberObj.avatar) {
            avatarURL = memberObj.avatarURL({ 'format': 'png', 'size': 256 });
        }
        loadImage(avatarURL).then(circleImage => {

            // Register fonts
            registerFont('./assets/fonts/code2000.ttf', { family: 'CODE2000' })
            registerFont('./assets/fonts/Impacted2.ttf', { family: 'Impacted2' })

            // Banner Image
            const width = image.width;
            const height = image.height;

            const canvas = createCanvas(width, height);
            const context = canvas.getContext('2d');

            // Draw Banner Image
            context.drawImage(image, 0, 0, width, height);

            context.font = 'bold 50px "Calibri"';
            const text1Width = canvas.context.measureText(upper).width;
            const text1col = parseInt(Math.random() * colors.length);
            context.fillStyle = colors[text1col];
            context.fillText(upper, parseInt((width - text1Width) / 2), 100);


            // Styling of the text under the avatar circle
            context.font = 'bold 40px "CODE2000"';
            context.textAlign = 'left';
            context.textBaseline = 'top';
            const username = memberObj.username;
            console.log(username);
            const textWidth = context.measureText(username).width;

            let nameTextCol = parseInt(Math.random() * colors.length);
            while (nameTextCol == text1col) nameTextCol = parseInt(Math.random() * colors.length);

            context.fillStyle = colors[nameTextCol];
            context.fillText(username, parseInt((width - textWidth) / 2), 320);

            let greetingTextCol = parseInt(Math.random() * colors.length);
            while (greetingTextCol == nameTextCol || greetingTextCol == text1col) greetingTextCol = parseInt(Math.random() * colors.length);
            context.fillStyle = colors[greetingTextCol];
            context.font = 'bold 50px Impacted2';
            const greetingWidth = context.measureText(tagline).width;
            context.fillText(tagline, parseInt((width - greetingWidth) / 2), 370);


            // Draw the circle of avatar
            context.beginPath();
            const centerX = parseInt(width / 2);
            const centerY = parseInt(height / 2);
            const radius = 95;
            const startAngle = 0;
            const endAngle = Math.PI * 2;
            context.arc(centerX, centerY, radius, startAngle, endAngle);
            context.closePath();
            context.clip();

            // Draw the avatar image into the circle
            const circleImageWidth = circleImage.width;
            const circleImageHeight = circleImage.height;
            console.log(circleImageWidth, circleImageHeight);
            context.drawImage(circleImage, centerX - 95, centerY - 95, circleImageWidth * .75, circleImageHeight * .75);

            //Stroke of the circle
            context.strokeStyle = "green";
            context.lineWidth = 10;
            context.stroke();

            context.restore();

            const buffer = canvas.toBuffer('image/png');
            try {
                fs.writeFileSync('./test.png', buffer);
                console.log("Saved");
                const attachments = new MessageAttachment('./test.png');
                console.log(attachments);
                channel.send({
                    files: [attachments],
                    content: `Hello`
                });
                return true;
            } catch (e) {
                return false;
            }
        }
        )

    });
}

module.exports = { sendMessage, messageHandler, fetchAllMessages, deleteMessages, handleMemberAdd, handleMemberRemove }