const { Events, EmbedBuilder } = require('discord.js');
const { getLogChannel } = require('../../functions/getLogChannel');

module.exports = {
    name: Events.GuildUpdate,
    async execute(oldGuild, newGuild) {
        if (oldGuild.icon !== newGuild.icon) {
            const LogChannel = await getLogChannel(newGuild, 'utility');
            if (!LogChannel) return;

            const oldIconURL = oldGuild.iconURL({ dynamic: true, size: 1024 });
            const newIconURL = newGuild.iconURL({ dynamic: true, size: 1024 });

            const embed = new EmbedBuilder()
                .setTitle('🖼️ Server Icon Updated')
                .setColor('#FFA500')
                .setDescription(`The server icon was updated.`)
                .addFields(
                    { name: 'Old Icon', value: oldIconURL ? `[View Old Icon](${oldIconURL})` : 'No previous icon', inline: true },
                    { name: 'New Icon', value: `[View New Icon](${newIconURL})`, inline: true }
                )
                .setImage(newIconURL)
                .setTimestamp();

            return LogChannel.send({ embeds: [embed] });
        }
    },
};
