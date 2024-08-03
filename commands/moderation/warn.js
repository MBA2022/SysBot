const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a user.')
        .addUserOption(option => option.setName('user').setDescription('The user to warn').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the warning').setRequired(false)),
    scope: 'global',
    developerOnly : 'false',
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return await interaction.reply({ content: '**🛑 You do not have permission to use this command.**', ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const maxWarnLevel = 5;
        const blacklistRoleName = 'PermanentBlacklist';

        try {
            const member = await interaction.guild.members.fetch(user.id);
            if (!member) {
                return await interaction.reply({ content: '**🛑 Could not find the specified user in this guild.**', ephemeral: true });
            }

            // Ensure the roles exist
            const createdRoles = {};
            const roleNames = [
                'Warn 1',
                'Warn 2',
                'Warn 3',
                'Warn 4',
                'Warn 5',
            ];

            const rolePermissions = {
                'Warn 1': {  },
                'Warn 2': { AddReactions: false },
                'Warn 3': { SendMessages: false, AddReactions: false },
                'Warn 4': { SendMessages: false, AddReactions: false, Connect: false },
                'Warn 5': { SendMessages: false, AddReactions: false, Connect: false, Speak: false },
            };

            for (let i = 0; i < maxWarnLevel; i++) {
                const roleName = roleNames[i];
                let role = interaction.guild.roles.cache.find(r => r.name === roleName);
                if (!role) {
                    role = await interaction.guild.roles.create({
                        name: roleName,
                        permissions: [],
                    });

                    // Update channel permissions for the new role
                    for (const channel of interaction.guild.channels.cache.values()) {
                        await channel.permissionOverwrites.create(role, rolePermissions[roleName]);
                    }
                }
                createdRoles[roleName] = role;
            }

            let blacklistRole = interaction.guild.roles.cache.find(r => r.name === blacklistRoleName);
            if (!blacklistRole) {
                blacklistRole = await interaction.guild.roles.create({
                    name: blacklistRoleName,
                    permissions: [],
                });

                // Update channel permissions for the blacklist role
                const blacklistPermissions = {
                    SendMessages: false,
                    AddReactions: false,
                    Connect: false,
                    Speak: false,
                    ViewChannel: false,
                };
                for (const channel of interaction.guild.channels.cache.values()) {
                    await channel.permissionOverwrites.create(blacklistRole, blacklistPermissions);
                }
            }

            // Determine the current warning level
            let currentWarnLevel = 0;
            for (let i = 0; i < maxWarnLevel; i++) {
                if (member.roles.cache.has(createdRoles[roleNames[i]].id)) {
                    currentWarnLevel = i + 1;
                    break;
                }
            }

            // Determine the new warning level
            let newWarnLevel = currentWarnLevel + 1;
            if (newWarnLevel > maxWarnLevel) {
                // Add to permanent blacklist
                await member.roles.set([blacklistRole.id]);
                const embed = new EmbedBuilder()
                    .setTitle("<a:TMF_warning:1256509650333863986>  Warn")
                    .setDescription(`\`\`\`ansi
[2;34m[2;30m[2;40m[2;31m[2;33m[2;35m[2;36m[2;42m[2;44m[2;45m[2;40m[2;31m[2;32m[2;34mYou has been blacklisted[0m[2;32m[2;40m[0m[2;31m[2;40m[0m[2;36m[2;40m[0m[2;36m[2;45m[0m[2;36m[2;44m[0m[2;36m[2;42m[2;43m[0m[2;36m[2;42m[0m[2;36m[2;40m[0m[2;35m[2;40m[0m[2;33m[2;40m[0m[2;31m[2;40m[0m[2;30m[2;40m[0m[2;30m[0m[2;34m[0m\`\`\`\n**Server:** \`${interaction.guild.name}\`\n**Reason:** \`${reason}\`\n`)
                    .setColor("#F6C42F");
                await user.send({ embeds: [embed] });
                
                
                const embed1 = new EmbedBuilder()
                    .setTitle("<:notification:1256478314600857631> Notification")
                    .setDescription(`\`${user.tag}\` has been **blacklisted**`)
                    .setColor("#f1bb32");
                return await interaction.reply({ embeds: [embed1] });
            } else {
                // Remove previous warn roles and add the new one
                await member.roles.remove(Object.values(createdRoles).map(role => role.id));
                await member.roles.add(createdRoles[roleNames[newWarnLevel - 1]]);
                const embed2 = new EmbedBuilder()
                    .setTitle("<a:TMF_warning:1256509650333863986>  Warn")
                    .setDescription(`\`\`\`ansi
[2;31mYou has been warned[0m\`\`\`\n**Warning Level:** \`${newWarnLevel}\`\n**Server:** \`${interaction.guild.name}\`\n**Reason:** \`${reason}\`\n`)
                    .setColor("#F6C42F");
                await user.send({ embeds: [embed2] });

                const embed3 = new EmbedBuilder()
                    .setTitle("<:notification:1256478314600857631> Notification")
                    .setDescription(`\`${user.tag}\` has been warned. **Warning Level: \`${newWarnLevel}\`**`)
                    .setColor("#f1bb32");
                await interaction.reply({ embeds: [embed3] });
            }
        } catch (error) {
            console.error('Error:', error);
            await interaction.reply({ content: '**🛑 Could not send a warning message to this user.**', ephemeral: true });
        }
    },
};
