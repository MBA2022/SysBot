const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('overlock')
        .setDescription('Disables specific permissions for the selected folder (channel).')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to disable permissions for')
                .setRequired(true)),
    scope: 'global',
    developerOnly : 'false',
    async execute(interaction) {
        // Check if the user has the necessary permissions
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.reply({ content: '**🛑 You do not have permission to use this command.**', ephemeral: true });
        }

        const channel = interaction.options.getChannel('channel');
        const everyoneRole = interaction.guild.roles.everyone;

        try {
            await channel.permissionOverwrites.edit(everyoneRole, {
                SendMessages: false,
                AddReactions: false,
                CreatePublicThreads: false,
                CreatePrivateThreads: false,
                SendMessagesInThreads: false,
                ManageThreads: false,
                ManageMessages: false,
                AttachFiles: false,
                EmbedLinks: false,
                Connect: false,
                UseApplicationCommands: false,
                // UseActivity and UseExternalApp are not valid, removed them
                // If you need to disable other permissions, make sure they are valid
            });

            const embed = new EmbedBuilder()
                .setTitle("<:notification:1256478314600857631> Notification")
                .setDescription(`**Channel have been __Overlocked__ for **\`${channel.name}\` 📴`)
                .setColor("#00b0f4");

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '**🛑 There was an error disabling the permissions.**', ephemeral: true });
        }
    },
};
