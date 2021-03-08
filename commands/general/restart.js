const { authorPermissions, goodbye } = require("../../libs/general/botMessages");
const { Message } = require('discord.js')
const { OWNER_ID } = require('../../config/auth.json');
const restartBot = require("../../libs/general/restartBot");

module.exports = {
  name: "restart",
  aliases: [],
  category: "general",
  description: "Restarts the bot. Only the guild/bot owner can use this.",
  /**
   * @param {Message} message
   */
  execute(message) {
    if (message.author.id !== message.guild.ownerID && message.author.id !== OWNER_ID) {
      message.channel.send(authorPermissions());
      return;
    }

    message.channel.send(goodbye())
      .then(() => restartBot(message.client));
  }
};
