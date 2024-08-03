/**
 * @name SysPro
 * @author MBA <mohdbm.amr@gmail.com>
 * @license MIT
 * @copyright (c) 2024 MBA {//}
 */

const dotenv = require('dotenv');
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');

dotenv.config();
const developers = ['1094937005160407131', '731813885895770165'];
module.exports = { developers };
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
