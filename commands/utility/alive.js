const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// Function to calculate bot latency
function calculatePing(interaction) {
	return Date.now() - interaction.createdTimestamp;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('alive')
		.setDescription('Replies with Alive!'),
	scope: 'guild',
	developerOnly: true,  // Use boolean true instead of string
	async execute(interaction) {
		const ping = calculatePing(interaction);
		const embed1 = new EmbedBuilder()
			.setTitle("Pinging <a:Loading:1252394245998772245>")
			.setDescription("Everything is under control")
			.setColor("#c90076");

		const embed2 = new EmbedBuilder()
			.setTitle("I'm Alive! <a:45450gummydragon11:1256465522141171712>")
			.setDescription(`Bot latency: ${ping}ms, API Latency: ${interaction.client.ws.ping}ms`)
			.setColor("#674ea7");

		// Send the first embed
		await interaction.reply({ embeds: [embed1] });

		// Simulate a delay to show the "Pinging" message before the actual ping values
		setTimeout(() => {
			interaction.editReply({ embeds: [embed2] });
		}, 2000);
	},
};
