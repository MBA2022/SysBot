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

// data base
const mongoose = require('mongoose');
dotenv.config();
const { MongoClient } = require('mongodb');
const { mongoURI } = process.env;



const developers = ['1094937005160407131', '731813885895770165']; // Developers ID's 
module.exports = { developers };
// Create a new client instance
const client = new Client({
    intents: [
        
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMembers
    ],
    partials: [Partials.Channel], // Required to receive DMs
});
module.exports = client;


const logs = require('discord-logs');
logs(client, {
    debug: true
});

client.commands = new Collection();
// Load command handler
const handleCommands = require('./handlers/handleCommands');
handleCommands(client);

// Load event handlers
const handleEvents = require('./handlers/handleEvents');
handleEvents(client);

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});
require('./deploy-commands');

// Log in to Discord with your client's token
client.login(process.env.TOKEN);
