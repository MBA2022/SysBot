// commands/announce.js
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('announce')
        .setDescription('Make an announcement in all servers')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The announcement message')
                .setRequired(true)),
    scope: 'guild',
	developerOnly: 'true',
    async execute(interaction) {
        const message = interaction.options.getString('message');
        await interaction.reply({ content: 'Announcement sent!', ephemeral: true });
        
        const guilds = interaction.client.guilds.cache;

        guilds.forEach(async (guild) => {
            const defaultChannel = guild.systemChannel || guild.channels.cache.find(channel => channel.type === 'GUILD_TEXT' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'));
            if (defaultChannel) {
                await defaultChannel.send(message);
            }
        });
    },
};
