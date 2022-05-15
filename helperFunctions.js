const { MessageAttachment } = require('discord.js');
const fs = require('fs');
const { registerFont, createCanvas, loadImage } = require('canvas');

const colors = ['#00FFFF', '#FF00FF', '#fff', '#FFFF00', '#00FF00', '#FFA500',];

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
        return
        console.log(message.author.avatarURL({ 'format': 'png', 'size': 256 }));
        constructImageAndSend(message.author, message.channel);

    }
    if(message.author.username === 'projuktivan'){
        roleManager(message.member, "Select your roles", false);
    }
}

async function fetchAllMessages(channel) {
    let messages = [];

    // Create message pointer
    let message = await channel.messages.fetch({ limit: 1 })
        .then(messagePage => (messagePage.size === 1 ? messagePage.at(0) : null));

    while (message) {
        await channel.messages.fetch({ limit: 100, before: message.id })
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
    roleManager(member, "Select Your Roles", true);

}

function handleMemberRemove(member) {
    const channel = member.guild.channels.cache.find(channel => channel.name === 'welcome-and-goodbyes');
    if (!channel) {
        console.log('Channel not found.');
        return;
    }
    // console.log(member.user);
    constructImageAndSend(member.user, channel, 'Goodbye', 'We\'ll mis you 😥');
    roleManager(member, "Select Your Roles", false);
}


async function constructImageAndSend(memberObj, channel, upper = "Welcome", tagline = "Have a great journey!") {
    // Retrieves all banners from wc-banner folder
    const banners = fs.readdirSync('./assets/images/wc-banner')
        .filter(file => file.endsWith('.png'));
    const selectedImage = banners[Math.floor(Math.random() * banners.length)]; // select a banner randomly

    const img = loadImage(`./assets/images/wc-banner/${selectedImage}`).then(image => {

        let avatarURL = 'https://siteforsuccess.com/JS/pcn_images/discord.jpg';     //default avatar
        if (memberObj.avatar) {
            avatarURL = memberObj.avatarURL({ 'format': 'png', 'size': 256 }); // get user avatar
        }
        loadImage(avatarURL).then(avatarImage => {

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
            // console.log(username);
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


            // Draw the circle around the avatar
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
            const avatarImageWidth = avatarImage.width;
            const avatarImageHeight = avatarImage.height;
            // console.log(avatarImageWidth, avatarImageHeight);
            context.drawImage(avatarImage, centerX - 95, centerY - 95, avatarImageWidth * .75, avatarImageHeight * .75);

            //Stroke of the circle
            context.strokeStyle = colors[Math.floor(Math.random() * colors.length)];
            context.lineWidth = 12;
            context.stroke();

            context.restore();

            // the actual constructed image
            const buffer = canvas.toBuffer('image/png');
            try {
                const filePath = './assets/images/bannerWithAvatar.png';
                fs.writeFileSync(filePath, buffer); // save the buffer to a file
                const attachments = new MessageAttachment(filePath);
                let message = `Huh! ${username} has just left us`;
                if (upper.toLowerCase() == 'welcome') {
                    message = `For detailed guide visit <#974719552929796108>.`;
                }
                channel.send({
                    files: [attachments],
                    content: message
                });
                return true;
            } catch (e) {
                return false;
            }
        }
        )

    });
}

// Adding a role while joining the server
function roleManager(member, theRole, operation = true) {
    // operation true means add.
    if (operation) {
        console.log("Need to add role");
        const role = member.guild.roles.cache.find(role => role.name == theRole);
        if (role) {
            console.log(`${member}`);
            member.roles.add(role);
            console.log("Successfully added role");
        }
    } else {
        console.log("Need to remove role");
        let check = member.roles.remove([theRole]);
        if(check) console.log(`Successfully removed ${theRole} form ${member.user.username}`);
    }
}


module.exports = { sendMessage, messageHandler, fetchAllMessages, deleteMessages, handleMemberAdd, handleMemberRemove }