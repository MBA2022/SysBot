const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");
const Schema = require("../../schema/logsSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("log-setup")
        .setDescription("Setup the log system in your server")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option => option
            .setName("moderation-channel")
            .setDescription("The channel for Moderation Logs")
            .setRequired(false)
        )
        .addChannelOption(option => option
            .setName("utility-channel")
            .setDescription("The channel for Utility Logs")
            .setRequired(false)
        ),
    scope: 'global',
    developerOnly : 'false',
    async execute(interaction) {
        const { options, guild } = interaction;
        let moderationChannel = options.getChannel("moderation-channel");
        let utilityChannel = options.getChannel("utility-channel");

        const data = await Schema.findOne({ Guild: guild.id });
        if (data) {
            return await interaction.reply("You already have an audit log system set up in this server!");
        }

        if (!moderationChannel || !utilityChannel) {
            // Create the "Logs System" category
            const category = await guild.channels.create({
                name: "Logs System",
                type: ChannelType.GuildCategory,
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone, // Deny everyone from viewing the category
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                ],
            });

            // Create "utility-logs" and "moderation-logs" channels under the category
            if (!utilityChannel) {
                utilityChannel = await guild.channels.create({
                    name: "utility-logs",
                    type: ChannelType.GuildText,
                    parent: category.id,
                    permissionOverwrites: [
                        {
                            id: guild.roles.everyone, // Deny everyone from sending messages
                            deny: [PermissionFlagsBits.SendMessages],
                        },
                    ],
                });
            }

            if (!moderationChannel) {
                moderationChannel = await guild.channels.create({
                    name: "moderation-logs",
                    type: ChannelType.GuildText,
                    parent: category.id,
                    permissionOverwrites: [
                        {
                            id: guild.roles.everyone, // Deny everyone from sending messages
                            deny: [PermissionFlagsBits.SendMessages],
                        },
                    ],
                });
            }

            await Schema.create({
                Guild: guild.id,
                UtilityChannel: utilityChannel.id,
                ModerationChannel: moderationChannel.id,
            });
            const botUser = interaction.client.user;
            const embed = new EmbedBuilder()
                .setTitle("Log Setup")
                .setDescription(`Log channels have been created:\n- ${utilityChannel}\n- ${moderationChannel}`)
                .setFooter({ text: 'Powered by SysPro', iconURL: botUser.displayAvatarURL({ dynamic: true }) })
                .setColor("White");

            return await interaction.reply({ embeds: [embed] });
        } else {
            // If both channels were provided by the user
            await Schema.create({
                Guild: guild.id,
                UtilityChannel: utilityChannel.id,
                ModerationChannel: moderationChannel.id,
            });

            const embed = new EmbedBuilder()
                .setTitle("Log Setup")
                .setDescription(`Your log channels have been set up:\n- ${utilityChannel}\n- ${moderationChannel}`)
                .setFooter({ text: 'Powered by SysPro', iconURL: botUser.displayAvatarURL({ dynamic: true }) })
                .setColor("White");

            return await interaction.reply({ embeds: [embed] });
        }
    }
};
