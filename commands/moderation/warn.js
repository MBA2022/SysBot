const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a user.')
        .addUserOption(option => option.setName('user').setDescription('The user to warn').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the warning').setRequired(false)),
    scope: 'global',
    developerOnly: false,
    async execute(interaction) {
        // Check if the command invoker has the required permissions
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return await interaction.reply({ content: '**🛑 You do not have permission to use this command.**', ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        try {
            const member = await interaction.guild.members.fetch(user.id);
            if (!member) {
                return await interaction.reply({ content: '**🛑 Could not find the specified user in this guild.**', ephemeral: true });
            }

            // Ensure the roles exist
            const roles = ['warn1', 'warn2', 'warn3'];
            const rolePermissions = {
                warn1: { [PermissionFlagsBits.AddReactions]: false },
                warn2: { [PermissionFlagsBits.SendMessages]: false, [PermissionFlagsBits.AddReactions]: false },
                warn3: { [PermissionFlagsBits.SendMessages]: false, [PermissionFlagsBits.AddReactions]: false, [PermissionFlagsBits.Connect]: false, [PermissionFlagsBits.Speak]: false }
            };
            const createdRoles = {};

            for (let roleName of roles) {
                let role = interaction.guild.roles.cache.find(r => r.name === roleName);
                if (!role) {
                    role = await interaction.guild.roles.create({
                        name: roleName,
                        permissions: []
                    });

                    // Update channel permissions for the new role
                    for (const channel of interaction.guild.channels.cache.values()) {
                        await channel.permissionOverwrites.create(role, rolePermissions[roleName]);
                    }
                }
                createdRoles[roleName] = role;
            }

            // Determine which role to assign
            let roleToAssign = createdRoles.warn1;
            if (member.roles.cache.has(createdRoles.warn1.id)) {
                roleToAssign = createdRoles.warn2;
            } else if (member.roles.cache.has(createdRoles.warn2.id)) {
                roleToAssign = createdRoles.warn3;
            }

            // Remove previous warn roles if any and add the new one
            await member.roles.remove(Object.values(createdRoles).map(role => role.id));
            await member.roles.add(roleToAssign);

            // Send a warning DM to the user
            await user.send(`> **<:notification:1256478314600857631> Hey <@${user.id}>**, You have been **__warned__** from **${interaction.guild.name}** Server for the following reason: **${reason}**, <a:TMF_warning:1256509650333863986> Warning Level: **${roleToAssign.name}**`);

            const embed = new EmbedBuilder()
                .setTitle("<:notification:1256478314600857631> Notification")
                .setDescription(`**${user.tag} has been warned 🚨 || ** Warning Level: **${roleToAssign.name}**`)
                .setColor("#f1bb32");

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error:', error);
            await interaction.reply({ content: '**🛑 Could not send a warning message to this user.**', ephemeral: true });
        }
    },
};
