const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
    ],
    partials: [Partials.Channel], // Required to receive DMs
});

client.commands = new Collection();
require('./deploy-commands');
// Load command handler
const handleCommands = require('./handlers/handleCommands');
handleCommands(client);

// Load event handlers
const handleEvents = require('./handlers/handleEvents');
handleEvents(client);

// Log in to Discord with your client's token
client.login(process.env.TOKEN);
