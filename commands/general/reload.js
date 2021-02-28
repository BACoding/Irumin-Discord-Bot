const { authorPermissions } = require("../../libs/general/botMessages");
const { Message } = require('discord.js')
const { loadCommands }  = require('../../libs/general/loadCommands');

module.exports = {
  name: "reload",
  aliases: [],
  category: "general",
  description: "Reloads bot commands. Only the guild/bot owner can use this.",
  /**
   * @param {Message} message
   */
  execute(message) {
    if (message.author.id !== message.guild.ownerID && message.author.id !== OWNER_ID) {
      message.channel.send(authorPermissions());
      return;
    }

    loadCommands(message.client);
    message.channel.send('Reloaded commands!');
  }
};
