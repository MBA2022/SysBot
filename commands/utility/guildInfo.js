const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Displays detailed server information'),
    scope: 'global',
    developerOnly : 'false',
    async execute(interaction) {
        const { guild } = interaction;

        // Calculating number of text and voice channels
        const textChannels = guild.channels.cache.filter(channel => channel.type === 0).size;
        const voiceChannels = guild.channels.cache.filter(channel => channel.type === 2).size;

        // Boost level and tier information
        const boostLevel = guild.premiumSubscriptionCount;
        const boostTier = guild.premiumTier;

        const embed = new EmbedBuilder()
            .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
            .setThumbnail(guild.iconURL({ dynamic: true })) // Using the server icon as thumbnail
            .setColor('#39d874') // A smooth, Discord-like color
            .addFields(
                { name: '🆔 **Server ID:**', value: `${guild.id}`, inline: true },
                { name: '📆 **Created On:**', value: `${guild.createdAt.toDateString()}`, inline: true },
                { name: '👑 **Owned by:**', value: `<@${guild.ownerId}>`, inline: true },
                { name: '👤 **Members:**', value: `${guild.memberCount} members`, inline: true },
                { name: '📝 **Text Channels:**', value: `${textChannels} Text`, inline: true },
                { name: '🎙️ **Voice Channels:**', value: `${voiceChannels} Voice`, inline: true },
                { name: '🔒 **Verification Level:**', value: `${guild.verificationLevel}`, inline: true },
                { name: '🚀 **Boosts:**', value: `${boostLevel} boosts (Tier ${boostTier})`, inline: true },
                { name: '🏷️ **Roles:**', value: `${guild.roles.cache.size} roles`, inline: true }
            )
            
            .setFooter({ text: 'To see a list with all roles use /roles'}); // Using server icon for footer

        await interaction.reply({ embeds: [embed] });
    },
};
