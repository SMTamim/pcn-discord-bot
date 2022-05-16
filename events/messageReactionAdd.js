const section = require("../assets/rules/section.json");
const semester = require("../assets/rules/semester.json");
const { roleManager } = require("../helperFunctions");

module.exports = {
    name: 'messageReactionAdd',
    async execute(reaction, user) {
        console.log(reaction.users.users);
        const member = await reaction.message.guild.members.fetch(user.id);

        if (reaction.emoji.name === 'pcn') {
            roleManager(member, '"Select Your Roles"', false);
            return;
        }
        // When a reaction is received, check if the structure is partial
        if (reaction.partial) {
            // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
            try {
                const react = await reaction.fetch();
            } catch (error) {
                console.error('Something went wrong when fetching the message:', error);
                // Return as `reaction.message.author` may be undefined/null
                return;
            }
        }
        const channel_id = reaction.message.channel.id;
        const reaction1 = semester[reaction.emoji.name] ? semester[reaction.emoji.name] : section[reaction.emoji.name];
        if (!reaction1) {
            console.log("Reaction Doesn't match any!")
            return;
        }
        if (reaction1.channel !== channel_id || reaction1.message !== reaction.message.id) {
            console.log("Invalid Channel or Unknown Message!");
            return;
        };
        roleManager(member, reaction1.role, true, true);
        // Now the message has been cached and is fully available
        console.log(`\n${reaction.message.author.username}'s message "${reaction.message.content}" gained a ${reaction.emoji.name} reaction!\n`);
        // The reaction is now also fully available and the properties will be reflected accurately:
        console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
    }
};