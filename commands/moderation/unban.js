const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unbans a member from the server.')
        .addStringOption(option => option.setName('userid').setDescription('The ID of the member to unban').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for the unban')),
    scope: 'global',
    developerOnly : 'false',
    async execute(interaction) {
        // Check if the command user has the Ban Members permission
        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.reply({ content: '**🛑 You do not have permission to use this command.**', ephemeral: true });
        }

        // Check if the bot has the Ban Members permission
        const botMember = interaction.guild.members.cache.get(interaction.client.user.id);
        if (!botMember.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.reply({ content: '**🛑 I do not have permission to unban members.**', ephemeral: true });
        }

        const userId = interaction.options.getString('userid');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        try {
            // Attempt to unban the user
            await interaction.guild.members.unban(userId, reason);
            const embed = new EmbedBuilder()
			.setTitle("<:notification:1256478314600857631> Notification")
			.setDescription(`**Successfully __unbanned__ the user with ID** \`${userId}\``)
			.setColor("#00b0f4")
            .setFooter({ text: 'Powered by SysPro', iconURL: botMember.displayAvatarURL({ dynamic: true }) });
            await interaction.reply({ embeds: [embed] });
            
        } catch (unbanError) {
            console.error('🛑 Error unbanning user:', unbanError);
            await interaction.reply({ content: `**🛑 There was an error trying to unban this user:** ${unbanError.message}`, ephemeral: true });
        }
    },
};
