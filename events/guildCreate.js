const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildCreate,
    async execute(guild) {
        try {
            const owner = await guild.fetchOwner();

            const embed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle('🔧 Bot Setup Instructions')
                .setDescription('Thanks for adding me! To ensure I work correctly, please follow these steps:')
                .addFields(
                    { name: '⭐ Recommendation', value: 'Create a "Trusted Bot" role with admin permissions and Keep it on top of user roles that i have to manage and assign it to me.' },
                    { name: '🔝 Why?', value: 'This keeps your server organized and secure.' },
                    { name: '📋 Steps', value: '1. Go to Server Settings\n2. Navigate to Roles\n3. Create "Trusted Bot" role\n4. Grant admin permissions\n5. Keep it on top of user roles to manage\n6. Assign role to me' }
                )
                .setFooter({ text: 'Need help? Join our support server!', iconURL: 'https://imgur.com/a/GAO5Zxv' });

            await owner.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error sending setup instructions to server owner:', error);
        }
    },
};
