const Guild = require("../schema/logsSchema");
const client = require('../index');
async function getLogChannel(guild, type) {
    const guildData = await Guild.findOne({ Guild: guild.id });
    if (!guildData) return null;

    let logChannelId;
    if (type === 'moderation') {
        logChannelId = guildData.ModerationChannel;
    } else if (type === 'utility') {
        logChannelId = guildData.UtilityChannel;
    }
    
    return client.channels.cache.get(logChannelId);
}
module.exports = { getLogChannel };
