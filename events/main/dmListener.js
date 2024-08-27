const { Events, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  name: Events.MessageCreate,
  async execute(message, client) {
    if (!message.guild) {
      // Message is in a DM
      try {
        const webhookURL = process.env.BOT_DM_WEBHOOK_URL; // Replace with your webhook URL

        // Create an embed with the message content if it exists
        const embed = new EmbedBuilder()
          .setColor(0x00AE86)
          .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
          .setTimestamp();

        // Only set the description if there is content in the message
        if (message.content && message.content.trim().length > 0) {
          embed.setDescription(message.content);
        } else {
          embed.setDescription('No text content');
        }

        // If the message has an attachment (e.g., image)
        if (message.attachments.size > 0) {
          const attachment = message.attachments.first(); // Get the first attachment
          if (attachment.contentType.startsWith('image/')) {
            embed.setImage(attachment.url); // Add the image to the embed
          }
        }

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
