const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Provides information about the available commands.')
        .addStringOption(option => 
            option.setName('command')
                .setDescription('Get help for a specific command')
                .setRequired(false)
                .addChoices(
                    { name: 'Clear', value: 'clear' },
                    { name: 'Ban', value: 'ban' },
                    { name: 'Unban', value: 'unban' },
                    { name: 'Kick', value: 'kick' },
                    { name: 'Warn', value: 'warn' },
                    { name: 'Lock', value: 'lock' },
                    { name: 'Unlock', value: 'unlock' },
                    { name: 'Overlock', value: 'overlock' },
                    { name: 'Alive', value: 'alive' },
                    { name: 'Embed', value: 'embed' },
                    { name: 'Server', value: 'server' },
                    { name: 'User', value: 'user' }
                )),
    scope: 'global',
    developerOnly : 'false',
    async execute(interaction) {
        const command = interaction.options.getString('command');

        const commandInfo = {
            clear: {
                emoji: '🧹',
                description: 'Clears a specified number of messages from the channel.',
                usage: '`/clear count:10` - Deletes 10 messages from the channel.'
            },
            ban: {
                emoji: '🔨',
                description: 'Bans a user from the server.',
                usage: '`/ban @username` - Bans the mentioned user from the server.'
            },
            unban: {
                emoji: '🛡️',
                description: 'Unbans a user from the server.',
                usage: '`/unban @username` - Unbans the mentioned user from the server.'
            },
            kick: {
                emoji: '🥾',
                description: 'Kicks a user from the server.',
                usage: '`/kick @username` - Kicks the mentioned user from the server.'
            },
            warn: {
                emoji: '⚠️',
                description: 'Warns a user in DM and assigns a punishment level.',
                usage: '`/warn @username level:1` - Warns the mentioned user and assigns them a level 1 punishment.'
            },
            lock: {
                emoji: '🔒',
                description: 'Locks the current channel, preventing users from sending messages.',
                usage: '`/lock` - Locks the current channel.'
            },
            unlock: {
                emoji: '🔓',
                description: 'Unlocks the current channel, allowing users to send messages.',
                usage: '`/unlock` - Unlocks the current channel.'
            },
            overlock: {
                emoji: '👁️',
                description: 'Disables all interaction permissions in a channel or folder.',
                usage: '`/overlock` - Disables user interactions in the current channel or folder.'
            },
            alive: {
                emoji: '💻',
                description: 'Checks if the bot is online.',
                usage: '`/alive` - Returns a message confirming the bot is online.'
            },
            embed: {
                emoji: '🖼️',
                description: 'Sends an embed message in the channel.',
                usage: '`/embed title:"Hello" description:"This is an embed"` - Sends an embed with the specified title and description.'
            },
            server: {
                emoji: '🏷️',
                description: 'Provide information about the server.',
                usage: '`/server` - Show detailed information about the server where the command is executed.'
            },
            user: {
                emoji: 'ℹ️',
                description: 'Provides information about a user.',
                usage: '`/userinfo @username` - Displays information about the mentioned user.'
            }
        };

        if (command) {
            const selectedCommand = commandInfo[command];

            if (!selectedCommand) {
                return interaction.reply({ content: '**🛑 Command not found. Please use a valid command.**', ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setColor('#7289da')
                .setTitle(`${selectedCommand.emoji} ${command.charAt(0).toUpperCase() + command.slice(1)} Command`)
                .setDescription(`**Description:**\n${selectedCommand.description}\n\n**Usage:**\n${selectedCommand.usage}`)
                .setFooter({ text: 'Use /help for more commands.' });

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        // If no specific command is selected, display the category dropdown
        const categories = {
            Moderation: [
                { label: 'Clear', description: '🧹 Clears a specified number of messages from the channel.' },
                { label: 'Ban', description: '🔨 Bans a user from the server.' },
                { label: 'Unban', description: '🛡️ Unbans a user from the server.' },
                { label: 'Kick', description: '🥾 Kicks a user from the server.' },
                { label: 'Warn', description: '⚠️ Warns a user in DM and assigns a punishment level.' },
                { label: 'Lock', description: '🔒 Locks the current channel, preventing users from sending messages.' },
                { label: 'Unlock', description: '🔓 Unlocks the current channel, allowing users to send messages.' },
                { label: 'Overlock', description: '👁️ Disables all interaction permissions in a channel or folder.' }
            ],
            Utility: [
                { label: 'Alive', description: '💻 Checks if the bot is online.' },
                { label: 'Embed', description: '🖼️ Sends an embed message in the channel.' },
                { label: 'Server', description: '🏷️ Provide information about the server."' },
                { label: 'User', description: 'ℹ️ Provides information about a user.' }
            ]
        };

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('helpMenu')
            .setPlaceholder('Select a category')
            .addOptions(
                Object.keys(categories).map(category => ({
                    label: category,
                    description: `Commands related to ${category.toLowerCase()}`,
                    value: category.toLowerCase()
                }))
            );

        const row = new ActionRowBuilder().addComponents(selectMenu);

        const embed = new EmbedBuilder()
            .setColor('#7289da')
            .setTitle('📜 Help Menu')
            .setDescription('Select a category from the dropdown below or specify a command for detailed help.')
            .setFooter({ text: 'Use /help [command] to get help for a specific command.' });

        await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });

        const filter = i => i.customId === 'helpMenu' && i.user.id === interaction.user.id;

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            const selectedCategory = i.values[0];
            const commands = categories[selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)];

            const commandList = commands.map(command => `**${command.label}**:\n\`\`\`yaml\n${command.description}\n\`\`\``).join('\n');

            const categoryEmbed = new EmbedBuilder()
                .setColor('#7289da')
                .setTitle(`${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Commands`)
                .setDescription(commandList)
                .setFooter({ text: 'Use /help [command] for more details on a specific command.' });

            await i.update({ embeds: [categoryEmbed], components: [row], ephemeral: true });
        });

        collector.on('end', collected => {
            interaction.editReply({ components: [] });
        });
    },
};
