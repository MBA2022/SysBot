const { Events } = require('discord.js');
const { developers } = require('../../index'); // Import the developers array


module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`**😓 No command matching ${interaction.commandName} was found.**`);
			return;
		}

		// Check if the command is restricted to developers
		if (command.developerOnly === 'true' && !developers.includes(interaction.user.id)) {
			await interaction.reply({ content: '**🛑 You do not have permission to use this command.**', ephemeral: true });
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: '**🛑 There was an error while executing this command!**', ephemeral: true });
			} else {
				await interaction.reply({ content: '**🛑 There was an error while executing this command!**', ephemeral: true });
			}
		}
	
	},
};
