const { Events, EmbedBuilder } = require('discord.js');
const { getLogChannel } = require('../../functions/getLogChannel');

module.exports = {
    name: Events.GuildRoleCreate,
    async execute(role) {
        const LogChannel = await getLogChannel(role.guild, 'moderation');
        if (!LogChannel) return;

        const embed = new EmbedBuilder()
            .setTitle('🎨 New Role Created')
            .setColor('#00FF00')
            .setDescription(`A new role **<@&${role.id}>** was created.`)  // Mention the role using <@&role_id>
            .addFields(
                { name: 'Role ID', value: `${role.id}`, inline: true },  // Display the role ID
                { name: 'Mention', value: `<@&${role.id}>`, inline: true }  // Mention the role
            )
            .setTimestamp();

        return LogChannel.send({ embeds: [embed] });
    },
};
