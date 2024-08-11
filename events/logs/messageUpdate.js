const { Events, EmbedBuilder } = require('discord.js');
const { getLogChannel } = require('../../functions/getLogChannel');

module.exports = {
    name: Events.MessageUpdate,
    async execute(oldMessage, newMessage) {
        // Ignore partial messages or messages from bots
        if (oldMessage.partial || newMessage.partial || oldMessage.author.bot) return;

        const LogChannel = await getLogChannel(newMessage.guild, 'moderation');
        if (!LogChannel) return;

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${newMessage.author.tag}`, iconURL: newMessage.author.displayAvatarURL({ dynamic: true }) })
            .setTitle('✏️ Message Edited')
            .setColor('#FFA500')
            .setDescription(`A message in **<#${newMessage.channel.id}>** was edited.`)
            .addFields(
                {
                    name: '✏️ Old Content',
                    value: oldMessage.content ? `\`\`\`${oldMessage.content}\`\`\`` : '_No content available_',
                },
                {
                    name: '📝 New Content',
                    value: newMessage.content ? `\`\`\`${newMessage.content}\`\`\`` : '_No content available_',
                },
                {
                    name: '🕒 Edited At',
                    value: `<t:${Math.floor(newMessage.editedTimestamp / 1000)}:F>`,
                    inline: true,
                },
                {
                    name: '🔗 Channel',
                    value: `<#${newMessage.channel.id}>`,
                    inline: true,
                }
            )
        
            .setFooter({ text: `Message ID: ${newMessage.id}` })
            .setTimestamp();

        return LogChannel.send({ embeds: [embed] });
    },
};
