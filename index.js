const { Client, Intents, Collection, Permissions } = require('discord.js');
const fs = require('fs');
const { token, guildId, clientId } = require('./config.json');
const helpers = require('./helperFunctions.js');

const client = new Client({
    intents: [
        'DIRECT_MESSAGES',
        'DIRECT_MESSAGE_REACTIONS',
        'GUILD_MESSAGES',
        'GUILD_MESSAGE_REACTIONS',
        'GUILDS',
        'GUILD_MEMBERS',
        'GUILD_BANS',
        'GUILD_EMOJIS_AND_STICKERS',
        'GUILD_INTEGRATIONS',
        'GUILD_WEBHOOKS',
        'GUILD_INVITES',
        'GUILD_VOICE_STATES',
        'GUILD_PRESENCES',
        'GUILD_MESSAGE_TYPING',
        'DIRECT_MESSAGE_TYPING',
        'GUILD_SCHEDULED_EVENTS',
    ]
});

// new Client({
//     partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
//     intents: ['DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILDS']
// });

//const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity("Tamim's PC! 😐", { type: 'PLAYING' });
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
        const msgCount = await helpers.fetchAllMessages(channel);
        await interaction.reply(`The channel ${channel.name} has total ${msgCount.length} messages.`);
    }
    // if (interaction.commandName === 'clr') {
    //     console.log("ROLES", interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES));
    //     if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
    //         interaction.reply(`You don't have  the permission to delete messages`);
    //         return
    //     }
    //     let deleteCount = interaction.options.get('number') ? parseInt(interaction.options.get('number').value) + 1 : 'all';
    //     if (deleteCount === 101) deleteCount = 100;
    //     console.log(deleteCount);
    //     if (deleteCount > 100) {
    //         interaction.reply("You can't delete messages more than 100. For that just say /clr");
    //         return;
    //     }
    //     const channel = client.channels.cache.get(interaction.channelId);
    //     const size = await helpers.deleteMessages(channel, deleteCount);
    //     interaction.reply(`Deleting ${size} messages`);
    // }
});


client.on("messageCreate", (message) => {
    if (message.author.bot) return false;
    console.log(`Message from ${message.author.username}: ${message.content}`);
    helpers.messageHandler(message);
});
client.login(token);

// Handle new member join
client.on('guildMemberAdd', member => helpers.handleMemberAdd(member));
client.on('guildMemberRemove', member => helpers.handleMemberRemove(member));
