const { authorPermissions, goodbye } = require("../../libs/general/botMessages");
const { OWNER_ID } = require('../../config/auth.json');
const { Message } = require('discord.js')
const killBot = require('../../libs/general/killBot');

module.exports = {
  name: "disconnect",
  aliases: ["quit", "fuckoff", "kill", "ko"],
  category: "general",
  description: "Closes the bot. Only the owner can use this.",
  /**
   * @param {Message} message
   */
  execute(message) {
    if (message.author.id !== OWNER_ID) {
      message.channel.send(authorPermissions());
      return;
    }

    message.channel.send(goodbye())
      .then(() => killBot(message.client));
  }
};
