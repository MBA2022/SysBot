const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clears a specified number of messages from the channel.')
        .addIntegerOption(option =>
            option.setName('count')
                .setDescription('The number of messages to delete')
                .setRequired(true)),
    scope: 'global',
    developerOnly: false,
    async execute(interaction) {
        // Check if the user has the necessary permissions
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply({ content: '**🛑 You do not have permission to use this command.', ephemeral: true });
        }

        const count = interaction.options.getInteger('count');

        if (count < 1 || count > 100) {
            return interaction.reply({ content: '**🛑 Please provide a number between 1 and 100.**', ephemeral: true });
        }

        try {
            await interaction.channel.bulkDelete(count, true);
            await interaction.reply({ content: `**🧹 Successfully deleted ${count} messages.**`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '**🛑 There was an error trying to clear messages in this channel.**', ephemeral: true });
        }
    },
};
