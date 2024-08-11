const { Events, EmbedBuilder } = require('discord.js');
const { getLogChannel } = require('../../functions/getLogChannel');

module.exports = {
    name: Events.GuildRoleUpdate,
    async execute(oldRole, newRole) {
        const LogChannel = await getLogChannel(newRole.guild, 'moderation');
        if (!LogChannel) return;

        if (oldRole.position !== newRole.position) {
            const embed = new EmbedBuilder()
                .setTitle('🔄 Role Position Updated')
                .setColor('#FFA500')
                .setDescription(`Role **<@&${newRole.id}>** changed position.`)
                .addFields(
                    { name: 'Old Position', value: `${oldRole.position}`, inline: true },
                    { name: 'New Position', value: `${newRole.position}`, inline: true },
                    { name: 'Role ID', value: `${newRole.id}`, inline: true }
                )
                .setTimestamp();

            return LogChannel.send({ embeds: [embed] });
        }
    },
};
