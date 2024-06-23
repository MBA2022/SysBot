const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

// Function to calculate bot latency
function calculatePing(interaction) {
	return Date.now() - interaction.createdTimestamp;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('alive')
     	.setDescription('Replies with Alive!'),
    scope: 'guild',
	developerOnly: true,
	async execute(interaction) {
		const ping = calculatePing(interaction);
		const embed1 = new EmbedBuilder()
			.setTitle("Pinging  <a:Loading:1252394245998772245>")
			.setDescription("Everything is under control")
			.setColor("#00b0f4");

		const embed2 = new EmbedBuilder()
			.setTitle(" I'm Alive! <a:67366gummydragon25:1253429052019314710>")
			.setDescription(`Bot latency: ${ping}ms, API Latency: ${interaction.client.ws.ping}ms`)
			.setColor("#00b0f4");

		await interaction.reply({ embeds: [embed1] });

		// Simulate a delay to show the "Pinging" message before the actual ping values
		setTimeout(() => {
			interaction.editReply({ embeds: [embed2] });
		}, 2000);
	},

};