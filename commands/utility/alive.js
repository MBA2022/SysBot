const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const embed = new EmbedBuilder()
  .setTitle("I'm Alive!")
  .setDescription("Everything is under control  <a:Loading:1252394245998772245>")
  .setColor("#00b0f4");
module.exports = {
	data: new SlashCommandBuilder()
		.setName('alive')
		.setDescription('Replies with Alive!'),
	async execute(interaction) {
		
		await interaction.reply({ embeds: [embed] });
	},
};