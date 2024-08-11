const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('Locks the channel, preventing everyone from sending messages.'),
    scope: 'global',
    developerOnly : 'false',
    async execute(interaction) {
        // Check if the user has the necessary permissions
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.reply({ content: '**🛑 You do not have permission to use this command.**', ephemeral: true });
        }

        const channel = interaction.channel;
        const everyoneRole = interaction.guild.roles.everyone;
        const botUser = interaction.client.user;
        try {
            await channel.permissionOverwrites.edit(everyoneRole, {
                SendMessages: false,
            });
            const embed = new EmbedBuilder()
			.setTitle("<:notification:1256478314600857631> Notification")
			.setDescription(`** <#${channel.id}> has been __locked__ 🔒**`)
			.setColor("#00b0f4")
            .setFooter({ text: 'Powered by SysPro', iconURL: botUser.displayAvatarURL({ dynamic: true }) });
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '**🛑 There was an error locking the channel.**', ephemeral: true });
        }
    },
};
