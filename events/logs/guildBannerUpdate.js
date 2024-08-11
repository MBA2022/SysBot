const { Events, EmbedBuilder } = require('discord.js');
const { getLogChannel } = require('../../functions/getLogChannel');

module.exports = {
    name: Events.GuildUpdate,
    async execute(oldGuild, newGuild) {
        if (oldGuild.banner !== newGuild.banner) {
            const LogChannel = await getLogChannel(newGuild, 'utility');
            if (!LogChannel) return;

            const oldBannerURL = oldGuild.bannerURL({ size: 1024 });
            const newBannerURL = newGuild.bannerURL({ size: 1024 });

            const embed = new EmbedBuilder()
                .setTitle('🎨 Server Banner Updated')
                .setColor('#FFA500')
                .setDescription(`The server banner was updated.`)
                .addFields(
                    { name: 'Old Banner', value: oldBannerURL ? `[View Old Banner](${oldBannerURL})` : 'No previous banner', inline: true },
                    { name: 'New Banner', value: newBannerURL ? `[View New Banner](${newBannerURL})` : 'No new banner', inline: true }
                )
                .setImage(newBannerURL)
                .setTimestamp();

            return LogChannel.send({ embeds: [embed] });
        }
    },
};
