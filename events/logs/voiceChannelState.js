const { Events, EmbedBuilder } = require('discord.js');
const { getLogChannel } = require('../../functions/getLogChannel');

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState) {
        const LogChannel = await getLogChannel(newState.guild, 'utility');
        if (!LogChannel) return;

        let embed;

        // User joined a voice channel
        if (!oldState.channel && newState.channel) {
            embed = new EmbedBuilder()
                .setTitle('🔊 Voice Channel Joined')
                .setColor('#00FF00')
                .setDescription(`<@${newState.member.user.id}> joined voice channel <#${newState.channel.id}>`);
        }

        // User left a voice channel
        else if (oldState.channel && !newState.channel) {
            embed = new EmbedBuilder()
                .setTitle('🔇 Voice Channel Left')
                .setColor('#FF0000')
                .setDescription(`<@${oldState.member.user.id}> left voice channel <#${oldState.channel.id}>`);
        }

        // User moved to another voice channel
        else if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
            embed = new EmbedBuilder()
                .setTitle('🔄 Voice Channel Moved')
                .setColor('#FFA500')
                .setDescription(`<@${newState.member.user.id}> moved from **${oldState.channel.name}** to <#${newState.channel.id}>`);
        }

        // Send the embed if one was created
        if (embed) {
            return LogChannel.send({ embeds: [embed] });
        }
    },
};
