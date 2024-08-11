const { Events, EmbedBuilder } = require('discord.js');
const { getLogChannel } = require('../../functions/getLogChannel');

module.exports = {
    name: Events.GuildUpdate,
    async execute(oldGuild, newGuild) {
        if (oldGuild.name !== newGuild.name) {
            const LogChannel = await getLogChannel(newGuild, 'utility');
            if (!LogChannel) return;

            const embed = new EmbedBuilder()
                .setTitle('📝 Server Name Updated')
                .setColor('#FFA500')
                .setDescription('The server has been renamed.')
                .addFields(
                    { name: 'Old Name', value: `\`${oldGuild.name}\``, inline: true },
                    { name: 'New Name', value: `\`${newGuild.name}\``, inline: true }
                )
                .setThumbnail(newGuild.iconURL({ dynamic: true }))
                .setFooter({ text: `Guild ID: ${newGuild.id}` })
                .setTimestamp();

            return LogChannel.send({ embeds: [embed] });
        }
    },
};
