const { Client, Intents, Collection } = require('discord.js');

const { token, guildId, clientId } = require('./config.json');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });

// new Client({
//     partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
//     intents: ['DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILDS']
// });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity("in Tamim's PC! 😐", { type: 'PLAYING' });
    client.user.setStatus('active');
});



client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!');
    }
    if (interaction.commandName === 'hello') {
        console.log("Hello");
        await interaction.reply('Hi');
    }
    if (interaction.commandName === 'msgcount') {
        const channel = client.channels.cache.get(interaction.channelId);
        const msgCount = await fetchAllMessages(channel);
        await interaction.reply(`The channel ${channel.name} has total ${msgCount.length} messages.`);
    }
    if (interaction.commandName === 'cc') {
        const deleteCount = interaction.options.get('number') ? parseInt(interaction.options.get('number').value) + 1 : 'all';
        console.log(deleteCount);
        const channel = client.channels.cache.get(interaction.channelId);
        const size = await deleteMessages(channel, deleteCount);
        interaction.reply(`Deleting ${size} messages`);
    }
});


client.on("messageCreate", (message) => {
    if (message.author.bot) return false;
    console.log(`Message from ${message.author.username}: ${message.content}`);
    messageHandler(message);
});
client.login(token);

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
    else {
        sendMessage(message, message.content);
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