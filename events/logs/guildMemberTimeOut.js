const { Events, EmbedBuilder, AuditLogEvent } = require('discord.js');
const { getLogChannel } = require('../../functions/getLogChannel');

module.exports = {
    name: Events.GuildMemberUpdate,
    async execute(oldMember, newMember) {
        const LogChannel = await getLogChannel(newMember.guild, 'moderation');
        if (!LogChannel) return;

        // Check if the timeout was added or removed
        if (oldMember.communicationDisabledUntil !== newMember.communicationDisabledUntil) {
            let embed;

            if (newMember.communicationDisabledUntil && !oldMember.communicationDisabledUntil) {
                // User was timed out
                const timeoutUntil = `<t:${Math.floor(newMember.communicationDisabledUntil.getTime() / 1000)}:F>`;
                
                // Fetch the audit log entry to get the reason and the moderator who timed out the user
                const fetchedLogs = await newMember.guild.fetchAuditLogs({
                    limit: 1,
                    type: AuditLogEvent.MemberUpdate, // Use the appropriate constant
                });
                const auditEntry = fetchedLogs.entries.first();
                const { executor, reason } = auditEntry || { executor: null, reason: 'No reason provided' };

                embed = new EmbedBuilder()
                    .setAuthor({
                        name: newMember.user.tag,
                        iconURL: newMember.user.displayAvatarURL({ dynamic: true }),
                    })
                    .setTitle('⏳ User Timed Out')
                    .setColor('#FFA500')
                    .setDescription(`**<@${newMember.user.id}>** has been timed out until ${timeoutUntil}.`)
                    .addFields(
                        { name: 'Reason', value: reason || 'No reason provided' },
                        { name: 'Timed Out By', value: executor ? `<@${executor.id}>` : 'Unknown' },
                        { name: 'Time Set', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true },
                        { name: 'Timeout Ends', value: timeoutUntil, inline: true }
                    )
                    .setFooter({ text: `User ID: ${newMember.user.id}` })
                    .setTimestamp();

            } else if (!newMember.communicationDisabledUntil && oldMember.communicationDisabledUntil) {
                // Timeout was removed
                
                // Fetch the audit log entry to get the moderator who removed the timeout
                const fetchedLogs = await newMember.guild.fetchAuditLogs({
                    limit: 1,
                    type: AuditLogEvent.MemberUpdate, // Use the appropriate constant
                });
                const auditEntry = fetchedLogs.entries.first();
                const { executor } = auditEntry || { executor: null };

                embed = new EmbedBuilder()
                    .setAuthor({
                        name: newMember.user.tag,
                        iconURL: newMember.user.displayAvatarURL({ dynamic: true }),
                    })
                    .setTitle('✅ Timeout Removed')
                    .setColor('#00FF00')
                    .setDescription(`**<@${newMember.user.id}>**'s timeout has been removed.`)
                    .addFields(
                        { name: 'Timeout Duration', value: `<t:${Math.floor(oldMember.communicationDisabledUntil.getTime() / 1000)}:R>` },
                        { name: 'Removed By', value: executor ? `<@${executor.id}>` : 'Unknown' },
                    )
                    .setFooter({ text: `User ID: ${newMember.user.id}` })
                    .setTimestamp();
            }

            if (embed) {
                return LogChannel.send({ embeds: [embed] });
            }
        }
    },
};
