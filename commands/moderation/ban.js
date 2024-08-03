const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bans a member from the server.')
        .addUserOption(option => option.setName('target').setDescription('The member to ban').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for the ban')),
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
            return interaction.reply({ content: '**🛑 I do not have permission to ban members.**', ephemeral: true });
        }

        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        const member = interaction.guild.members.cache.get(target.id);
        if (!member) {
            return interaction.reply({ content: '**🛑 User not found!**', ephemeral: true });
        }

        // Check if the bot's role is higher than the target's role
        if (botMember.roles.highest.position <= member.roles.highest.position) {
            return interaction.reply({ content: '**🛑 I cannot ban this user because their role is higher or equal to mine.**', ephemeral: true });
        }

        try {
            // Attempt to send a DM to the user
            await target.send(`> **<:notification:1256478314600857631> Hey <@${target.id}>**, You have been ** __banned__ <:banhammer:1256466058282532928> ** from **${interaction.guild.name}** for the following reason:** ${reason} **`);
        } catch (dmError) {
            console.error('🛑 Error sending DM:', dmError);
        }

        // Proceed to ban the user regardless of DM success
        try {
            await member.ban({ reason });
            const embed = new EmbedBuilder()
            .setTitle("<:notification:1256478314600857631> Notification")
			.setDescription(`**Successfully __banned__ \`${target.tag}\` <:banhammer:1256466058282532928>**` )
			.setColor("#dd3f3f");
            await interaction.reply({ embeds: [embed] });
        } catch (banError) {
            console.error(' Error banning user:', banError);
            await interaction.reply({ content: `**🛑 There was an error trying to ban this user: ** ${banError.message}`, ephemeral: true });
        }
    },
};
