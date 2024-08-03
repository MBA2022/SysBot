const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Displays information about a user')
		.addUserOption(option =>
			option.setName('target')
				.setDescription('The user to get information about')
				.setRequired(false)
		),
    scope: 'global',
    developerOnly: 'false',
	async execute(interaction) {
		// Get the target user, or default to the user who invoked the command
		const targetUser = interaction.options.getUser('target') || interaction.user;
		const member = interaction.guild.members.cache.get(targetUser.id);

		// Format the creation date for Discord's timestamp format
		const creationDate = `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:F>`;
		const joinDate = `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`;

		// Get the bot's user object to use its avatar in the footer
		const botUser = interaction.client.user;

		// Create an embed with user information
		const embed = new EmbedBuilder()
			.setAuthor({ name: `${targetUser.tag}`, iconURL: targetUser.displayAvatarURL({ dynamic: true }) })
			.setColor('#436df3') // A smooth, Discord-like color
			.setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
			.addFields(
				{ name: '🆔 **User ID:**', value: `${targetUser.id}`, inline: true },
				{ name: '👤 **Global Username:**', value: `${targetUser.username}`, inline: true },
				{ name: '🏷️ **Server Nickname:**', value: member.nickname ? member.nickname : 'No nickname', inline: true },
				{ name: '📅 **Account Created:**', value: `${creationDate}`, inline: false },
				{ name: '📆 **Joined Server:**', value: `${joinDate}`, inline: false },
				{ name: '✨ **Roles:**', value: `${member.roles.cache.map(role => role.toString()).join(', ')}`, inline: false }
			)
			.setFooter({ text: `Information about ${targetUser.username}`});

		// Reply with the embed
		await interaction.reply({ embeds: [embed] });
	},
};
