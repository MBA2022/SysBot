const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Replies with a customizable embed!')
        .addStringOption(option => 
            option.setName('title')
                .setDescription('Title of the embed')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('description')
                .setDescription('Description of the embed')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('color')
                .setDescription('Color of the embed')
                .addChoices(
                    { name: 'Default', value: '#00b0f4' },
                    { name: 'Red', value: '#ff0000' },
                    { name: 'Green', value: '#00ff00' },
                    { name: 'Blue', value: '#0000ff' },
                    { name: 'Yellow', value: '#ffff00' },
                    { name: 'Purple', value: '#800080' },
                    { name: 'Black', value: '#000000' }
                )
                .setRequired(false))
        .addStringOption(option => 
            option.setName('footer')
                .setDescription('Footer text of the embed')
                .setRequired(false))
        .addStringOption(option => 
            option.setName('thumbnail')
                .setDescription('URL of the thumbnail image')
                .setRequired(false)),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({ content: '🛑 You do not have permission to use this command.', ephemeral: true });
        }

        // Extract options from the interaction
        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description');
        const color = interaction.options.getString('color') || '#00b0f4';
        const footer = interaction.options.getString('footer');
        const thumbnail = interaction.options.getString('thumbnail');

        // Create the initial embed
        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(color);

        if (footer) {
            embed.setFooter({ text: footer });
        }

        if (thumbnail) {
            embed.setThumbnail(thumbnail);
        }

        // Reply with the initial embed
        await interaction.reply({ embeds: [embed] });
    },
};
