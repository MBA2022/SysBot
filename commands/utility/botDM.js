const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dm')
        .setDescription('Sends a DM to a member.')
        .addSubcommand(subcommand => 
            subcommand
                .setName('message')
                .setDescription('Send a text message')
                .addUserOption(option => option.setName('target').setDescription('The member to DM').setRequired(true))
                .addStringOption(option => option.setName('content').setDescription('The message content').setRequired(true))
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName('embed')
                .setDescription('Send an embed message')
                .addUserOption(option => option.setName('target').setDescription('The member to DM').setRequired(true))
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
                ).setRequired(false))
                .addStringOption(option => 
                    option.setName('footer')
                    .setDescription('Footer text of the embed')
                    .setRequired(false))
                .addStringOption(option => 
                    option.setName('image')
                    .setDescription('URL of the image')
                    .setRequired(false))
                .addStringOption(option => 
                    option.setName('thumbnail')
                    .setDescription('URL of the thumbnail image')
                    .setRequired(false)),
        ),
    scope: 'global',
    developerOnly: false,
    async execute(interaction) {
        // Check if the command user has the Manage Messages permission
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({ content: '**🛑 You do not have permission to use this command.**', ephemeral: true });
        }

        const subcommand = interaction.options.getSubcommand();
        const target = interaction.options.getUser('target');

        if (!target) {
            return interaction.reply({ content: '**🛑 User not found!**', ephemeral: true });
        }

        try {
            if (subcommand === 'message') {
                const content = interaction.options.getString('content');
                // Send a plain text message
                await target.send(content);
                await interaction.reply({ content: `**✅ Successfully sent a message to \`${target.tag}\`**`, ephemeral: true });
            } else if (subcommand === 'embed') {
                const title = interaction.options.getString('title');
                const description = interaction.options.getString('description');
                const color = interaction.options.getString('color') || '#00b0f4';
                const image = interaction.options.getString('image');
                const footer = interaction.options.getString('footer');
                const thumbnail = interaction.options.getString('thumbnail');

                // Create the initial embed
                const embed = new EmbedBuilder()
                    .setTitle(title)
                    .setDescription(description)
                    .setColor(color);
                if (image) {
                    embed.setImage(image);
                }
                if (footer) {
                    embed.setFooter({ text: footer });
                }
                
                if (thumbnail) {
                    embed.setThumbnail(thumbnail);
                }

                await target.send({ embeds: [embed] });
                await interaction.reply({ content: `**✅ Successfully sent an embed to \`${target.tag}\`**`, ephemeral: true });
            } else {
                return interaction.reply({ content: '**🛑 Invalid subcommand!**', ephemeral: true });
            }
        } catch (dmError) {
            console.error('🛑 Error sending DM:', dmError);
            await interaction.reply({ content: `**🛑 There was an error trying to send a DM to this user: ** ${dmError.message}`, ephemeral: true });
        }
    },
};
