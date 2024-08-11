const { Events, EmbedBuilder, ChannelType } = require('discord.js');
const { getLogChannel } = require('../../functions/getLogChannel');

module.exports = {
    name: Events.ChannelCreate,
    async execute(channel) {
        const LogChannel = await getLogChannel(channel.guild, 'moderation');
        if (!LogChannel) return;

        let channelType;
        switch (channel.type) {
            case ChannelType.GuildText:
                channelType = 'Text';
                break;
            case ChannelType.GuildVoice:
                channelType = 'Voice';
                break;
            case ChannelType.GuildCategory:
                channelType = 'Category';
                break;
            case ChannelType.GuildNews:
                channelType = 'News';
                break;
            case ChannelType.GuildStageVoice:
                channelType = 'Stage';
                break;
            case ChannelType.GuildForum:
                channelType = 'Forum';
                break;
            default:
                channelType = 'Unknown';
        }

        const embed = new EmbedBuilder()
            .setColor('#00FF00') // Green color to indicate success
            .setTitle('🆕 New Channel Created')
            .setDescription(`A new ${channelType} channel **${channel}** was created.`) // Mention the channel
            .addFields(
                { name: 'Channel Name', value: `<#${channel.id}>`, inline: true }, // Mention the channel
                { name: 'Channel Type', value: `${channelType}`, inline: true }
            )
            .setThumbnail('https://example.com/your-thumbnail.png') // You can add a relevant thumbnail
            .setAuthor({ name: channel.guild.name, iconURL: channel.guild.iconURL({ dynamic: true }) })
            .setFooter({ text: `Channel ID: ${channel.id}` })
            .setTimestamp();

        return LogChannel.send({ embeds: [embed] });
    },
};
