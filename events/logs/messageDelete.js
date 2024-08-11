const { Events, EmbedBuilder } = require('discord.js');
const { getLogChannel } = require('../../functions/getLogChannel');

module.exports = {
    name: Events.MessageDelete,
    async execute(message) {
        const LogChannel = await getLogChannel(message.guild, 'moderation');
        if (!LogChannel) return;

        let descriptionText = `A message from <@${message.author.id}> in <#${message.channel.id}> was deleted.`;

        // Check if the deleted message had an embed
        if (message.embeds.length > 0) {
            descriptionText += `\n\n**Note:** The deleted message contained an embed.`;
        }

        // Define the embed
        const embed = new EmbedBuilder()
            .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setTitle('🗑️ Message Deleted')
            .setColor('#FF4C4C')
            .setDescription(descriptionText)
            .addFields(
                {
                    name: '📝 Message Content',
                    value: message.content ? `\`\`\`${message.content}\`\`\`` : '_No content available_',
                },
                {
                    name: '🕒 Timestamp',
                    value: `<t:${Math.floor(message.createdTimestamp / 1000)}:F>`,
                    inline: true,
                },
                {
                    name: '🔗 Channel',
                    value: `<#${message.channel.id}>`,
                    inline: true,
                }
            )
            .setFooter({ text: `Message ID: ${message.id}` })
            .setTimestamp();

        // Send the embed to the log channel
        return LogChannel.send({ embeds: [embed] });
    },
};
