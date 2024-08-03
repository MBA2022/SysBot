const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');

dotenv.config();
const globalCommands = [];
const guildCommands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			if (command.scope === 'global') {
				globalCommands.push(command.data.toJSON());
			} else {
				guildCommands.push(command.data.toJSON());
			}
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.TOKEN);

// and deploy your commands!
(async () => {
	try {
		if (globalCommands.length > 0) {
			console.log(`Started refreshing ${globalCommands.length} global application (/) commands.`);

			// Deploy global commands
			const data = await rest.put(
				Routes.applicationCommands(process.env.CLIENTID),
				{ body: globalCommands },
			);

			console.log(`Successfully reloaded ${data.length} global application (/) commands.`);
		}

		if (guildCommands.length > 0) {
			console.log(`Started refreshing ${guildCommands.length} guild application (/) commands.`);

			// Deploy guild commands
			const data = await rest.put(
				Routes.applicationGuildCommands(process.env.CLIENTID, process.env.GUILDID),
				{ body: guildCommands },
			);

			console.log(`Successfully reloaded ${data.length} guild application (/) commands.`);
		}
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();


