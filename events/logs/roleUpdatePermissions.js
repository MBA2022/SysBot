const { Events, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { getLogChannel } = require('../../functions/getLogChannel');

module.exports = {
    name: Events.GuildRoleUpdate,
    async execute(oldRole, newRole) {
        const LogChannel = await getLogChannel(newRole.guild, 'moderation');
        if (!LogChannel) return;

        if (oldRole.permissions.bitfield !== newRole.permissions.bitfield) {
            // Calculate the difference in permissions
            const addedPermissions = new PermissionsBitField(newRole.permissions).remove(oldRole.permissions).toArray();
            const removedPermissions = new PermissionsBitField(oldRole.permissions).remove(newRole.permissions).toArray();

            let changes = '';
            if (addedPermissions.length > 0) {
                changes += `**Added Permissions:**\n${addedPermissions.map(p => `\`${p}\``).join(', ')}\n`;
            }
            if (removedPermissions.length > 0) {
                changes += `**Removed Permissions:**\n${removedPermissions.map(p => `\`${p}\``).join(', ')}\n`;
            }

            const embed = new EmbedBuilder()
                .setTitle('🔒 Role Permissions Updated')
                .setColor('#FFA500')
                .setDescription(`Permissions for role **<@&${newRole.id}>** were updated.`)
                .addFields(
                    { name: 'Role ID', value: `${newRole.id}`, inline: true },
                    { name: 'Changes', value: changes || 'No specific changes detected', inline: false }
                )
                .setTimestamp();

            return LogChannel.send({ embeds: [embed] });
        }
    },
};
