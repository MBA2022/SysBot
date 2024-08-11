const { Events, EmbedBuilder } = require('discord.js');
const { getLogChannel } = require('../../functions/getLogChannel');

module.exports = {
    name: Events.ChannelUpdate,
    async execute(oldChannel, newChannel) {
        const LogChannel = await getLogChannel(newChannel.guild, 'moderation');
        if (!LogChannel) return;

        // Check for changes in permissions
        if (!oldChannel.permissionOverwrites.cache.equals(newChannel.permissionOverwrites.cache)) {
            const formatPermissions = (overwrites) => {
                const rolePermissions = {};

                overwrites.forEach(overwrite => {
                    const role = newChannel.guild.roles.cache.get(overwrite.id) || newChannel.guild.members.cache.get(overwrite.id) || 'Unknown';
                    const allowed = overwrite.allow.toArray();
                    const denied = overwrite.deny.toArray();

                    const permissions = allowed.length > 0
                        ? `✅ **Enabled**: ${allowed.map(perm => `\`${perm}\``).join(', ')}`
                        : '✅ **Enabled**: None';

                    const disallowed = denied.length > 0
                        ? `❌ **Disabled**: ${denied.map(perm => `\`${perm}\``).join(', ')}`
                        : '❌ **Disabled**: None';

                    rolePermissions[role] = `${permissions}\n${disallowed}`;
                });

                return Object.entries(rolePermissions).map(([role, perms]) => `${role}:\n${perms}`).join('\n\n');
            };

            const oldPermissions = formatPermissions(oldChannel.permissionOverwrites.cache);
            const newPermissions = formatPermissions(newChannel.permissionOverwrites.cache);

            const embed = new EmbedBuilder()
                .setTitle('🔒 Channel Permissions Updated')
                .setColor('#FFA500')
                .setDescription(`Permissions for channel **${newChannel}** were updated.`)
                .addFields(
                    { name: '🔻 **Old Permissions**', value: oldPermissions || 'No Permissions', inline: false },
                    { name: '🔺 **New Permissions**', value: newPermissions || 'No Permissions', inline: false }
                )
                .setFooter({ text: 'Channel Permissions Update', iconURL: newChannel.guild.iconURL() })
                .setTimestamp();

            return LogChannel.send({ embeds: [embed] });
        }
    },
};
