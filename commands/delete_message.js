const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cc')
        .setDescription('Deletes message!')
        .addIntegerOption(option =>
            option.setName('number')
                .setDescription('Number of messages to delete. Leave empty to delete all.')
                .setRequired(false)
        )
}

