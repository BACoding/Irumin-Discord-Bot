const { authorPermissions } = require("../../libs/general/botMessages");
const { OWNER_ID } = require('../../config/auth.json');
const { Message } = require('discord.js')
const loadCommands = require('../../libs/general/loadCommands');

module.exports = {
  name: "reload",
  aliases: [],
  category: "general",
  description: "Reloads commands.",
  /**
   * @param {Message} message
   */
  execute(message) {
    if (message.author.id !== OWNER_ID) {
      message.channel.send(authorPermissions());
      return;
    }

    loadCommands(message.client);
    message.channel.send('Reloaded commands!');
  }
};
