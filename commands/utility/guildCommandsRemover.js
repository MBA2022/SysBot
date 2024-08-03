const { SlashCommandBuilder } = require('discord.js');
const { REST, Routes } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();

const rest = new REST().setToken(process.env.TOKEN);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('removecommands')
		.setDescription('Removes all guild commands from a specified server')
        .addStringOption(option => 
            option.setName('guildid')
            .setDescription('The ID of the guild you want to remove commands from')
            .setRequired(true)
        ),
	scope: 'guild',
    developerOnly : 'true',
	async execute(interaction) {
		const guildIdToDelete = interaction.options.getString('guildid');

		try {
			// Fetch all the commands registered in the specified guild
			const commands = await rest.get(
				Routes.applicationGuildCommands(process.env.CLIENTID, guildIdToDelete)
			);

			if (commands.length === 0) {
				await interaction.reply(`No commands found for guild ID: ${guildIdToDelete}`);
				return;
			}

			// Loop through each command and delete it
			for (const command of commands) {
				await rest.delete(
					Routes.applicationGuildCommand(process.env.CLIENTID, guildIdToDelete, command.id)
				);
				console.log(`Deleted command ${command.name} from guild ${guildIdToDelete}`);
			}

			await interaction.reply(`Successfully removed all commands from guild ID: ${guildIdToDelete}`);
		} catch (error) {
			console.error('Error removing guild commands:', error);
			await interaction.reply(`There was an error removing commands: ${error.message}`);
		}
	},
};
