const { Events, EmbedBuilder } = require('discord.js');
const { getLogChannel } = require('../../functions/getLogChannel');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const LogChannel = await getLogChannel(member.guild, 'moderation');
        if (!LogChannel) return;

        const embed = new EmbedBuilder()
            .setTitle('👋 New Member Joined')
            .setColor('#00FF00')
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`Welcome <@${member.user.id}> to **${member.guild.name}**!`)
            .addFields(
                { name: 'Account Created', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:F>`, inline: true },
                { name: 'Join Position', value: `${member.guild.memberCount}`, inline: true },
            )
            .setFooter({ text: `Member ID: ${member.user.id}` })
            .setTimestamp();

        return LogChannel.send({ embeds: [embed] });
    },
};
