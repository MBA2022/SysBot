const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a member from the server.')
        .addUserOption(option => option.setName('target').setDescription('The member to kick').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for the kick')),
    scope: 'global',
    developerOnly: false,
    async execute(interaction) {
        // Check if the command user has the Kick Members permission
        if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
            return interaction.reply({ content: '**🛑 You do not have permission to use this command.**', ephemeral: true });
        }

        // Check if the bot has the Kick Members permission
        const botMember = interaction.guild.members.cache.get(interaction.client.user.id);
        if (!botMember.permissions.has(PermissionFlagsBits.KickMembers)) {
            return interaction.reply({ content: '**🛑 I do not have permission to kick members.**', ephemeral: true });
        }

        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        const member = interaction.guild.members.cache.get(target.id);
        if (!member) {
            return interaction.reply({ content: '**🛑 User not found!**', ephemeral: true });
        }

        // Check if the bot's role is higher than the target's role
        if (botMember.roles.highest.position <= member.roles.highest.position) {
            return interaction.reply({ content: '**🛑 I cannot kick this user because their role is higher or equal to mine.**', ephemeral: true });
        }

        try {
            // Attempt to send a DM to the user
            await target.send(`> **<:notification:1256478314600857631> Hey <@${target.id}>**,  You have been **__kicked__ 🔫** from **${interaction.guild.name}** for the following reason: **${reason}**`);
        } catch (dmError) {
            console.error('**🛑 Error sending DM:**', dmError);
        }

        // Proceed to kick the user regardless of DM success
        try {
            await member.kick(reason);
            const embed = new EmbedBuilder()
			.setTitle("<:notification:1256478314600857631> Notification")
			.setDescription(`**Successfully __kicked__  \`${target.tag}\` <:banhammer:1256466058282532928> **` )
			.setColor("#000000");
            await interaction.reply({ embeds: [embed] });
        } catch (kickError) {
            console.error('Error kicking user:', kickError);
            await interaction.reply({ content: '**🛑 There was an error trying to kick this user.**', ephemeral: true });
        }
    },
};
