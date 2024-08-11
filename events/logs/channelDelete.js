const { Events, EmbedBuilder, ChannelType } = require('discord.js');
const { getLogChannel } = require('../../functions/getLogChannel');

module.exports = {
    name: Events.ChannelDelete,
    async execute(channel) {
        const LogChannel = await getLogChannel(channel.guild, 'moderation');
        if (!LogChannel) return;

        let channelType;
        switch (channel.type) {
            case ChannelType.GuildText:
                channelType = 'Text Channel';
                break;
            case ChannelType.GuildVoice:
                channelType = 'Voice Channel';
                break;
            case ChannelType.GuildCategory:
                channelType = 'Category';
                break;
            case ChannelType.GuildNews:
                channelType = 'Announcement Channel';
                break;
            case ChannelType.GuildStageVoice:
                channelType = 'Stage Channel';
                break;
            case ChannelType.GuildForum:
                channelType = 'Forum Channel';
                break;
            default:
                channelType = 'Unknown Channel Type';
        }

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${channel.guild.name} | Channel Deleted`, iconURL: channel.guild.iconURL({ dynamic: true }) })
            .setTitle('🚨 A Channel was Deleted')
            .setColor('#FF5555')
            .setThumbnail(channel.guild.iconURL({ dynamic: true }))
            .setDescription(`**A ${channelType} has been deleted.**`)
            .addFields(
                { name: '🔤 Channel Name', value: `\`${channel.name}\``, inline: true },
                { name: '🔖 Channel Type', value: `\`${channelType}\``, inline: true },
                { name: '🆔 Channel ID', value: `\`${channel.id}\``, inline: false }
            )
  // Placeholder for a relevant image if desired
            .setFooter({ text: `Channel deleted at` })
            .setTimestamp();

        return LogChannel.send({ embeds: [embed] });
    },
};
