const { constructImageAndSend } = require('../helperFunctions');

module.exports = {
    name: 'guildMemberRemove',
    async execute(member) {
        const channel = member.guild.channels.cache.find(channel => channel.id === '965667610903597139');
        if (!channel) {
            console.log('Channel not found.');
            return;
        }
        constructImageAndSend(member.user, channel, 'Goodbye', 'We\'ll miss you 😥');
    }
}
