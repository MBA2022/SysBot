const { Events, EmbedBuilder } = require('discord.js');
const { getLogChannel } = require('../../functions/getLogChannel');

module.exports = {
    name: Events.GuildMemberUpdate,
    async execute(oldMember, newMember) {
        const LogChannel = await getLogChannel(newMember.guild, 'moderation');
        if (!LogChannel) return;

        const oldRoles = oldMember.roles.cache.map(role => role.id);
        const newRoles = newMember.roles.cache.map(role => role.id);
        const addedRoles = newRoles.filter(role => !oldRoles.includes(role));
        const removedRoles = oldRoles.filter(role => !newRoles.includes(role));

        if (addedRoles.length || removedRoles.length) {
            const addedRoleNames = addedRoles.map(roleId => `<@&${roleId}>`);
            const removedRoleNames = removedRoles.map(roleId => `<@&${roleId}>`);

            let description = `**User:** <@${newMember.user.id}>\n`;
            if (addedRoleNames.length) {
                description += `\n**Roles Added:**\n${addedRoleNames.map(role => `• ${role}`).join('\n')}\n`;
            }
            if (removedRoleNames.length) {
                description += `\n**Roles Removed:**\n${removedRoleNames.map(role => `• ${role}`).join('\n')}`;
            }

            const embed = new EmbedBuilder()
                .setAuthor({
                    name: `${newMember.user.tag}`,
                    iconURL: newMember.user.displayAvatarURL({ dynamic: true })
                })
                .setTitle('🎖️ User Role Update')
                .setColor(addedRoleNames.length && removedRoleNames.length ? '#FFFF00' : addedRoleNames.length ? '#00FF00' : '#FF0000')
                .setDescription(description)
                .setFooter({
                    text: `User ID: ${newMember.user.id} | Role Change`,
                    iconURL: newMember.user.displayAvatarURL({ dynamic: true })
                })
                .setTimestamp();

            return LogChannel.send({ embeds: [embed] });
        }
    },
};
