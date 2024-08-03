const { Events, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  name: Events.MessageCreate,
  async execute(message, client) {
    if (!message.guild) {
      // Message is in a DM
      try {
        const webhookURL = process.env.BOT_DM_WEBHOOK_URL; // Replace with your webhook URL

        // Create an embed with the message content
        const embed = new EmbedBuilder()
          .setColor(0x00AE86)
          .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
          .setDescription(message.content)
          .setTimestamp();

        // Send the message content to the target channel using the webhook
        await axios.post(webhookURL, {
          username: client.user.username, // Set the name of the webhook to the bot's name
          avatar_url: client.user.displayAvatarURL(), // Set the profile picture of the webhook to the bot's avatar
          embeds: [embed.toJSON()],
        });
      } catch (error) {
        console.error('Error sending message to target channel:', error);
      }
    }

  },
};
