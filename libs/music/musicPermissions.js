const { embedMessage } = require("../../libs/general/embedMessage");
const { IRUMIN_TUCC } = require("../../config/config.json");
const { Message } = require("discord.js");
const { getEmojiOrFallback } = require('../general/emojiUtils');

module.exports = {
  /**
   * @param {Message} message
   */
  musicPermissions(message) {
    const userChannel = message.member.voice?.channelID;
    const botChannel = message.member.guild.voice?.channelID;

    if (userChannel !== botChannel)
      return message.channel.send(embedMessage(`WHERE ARE YOU?`, `I need you with me <@${member.id}>, together in voice! ${getEmojiOrFallback(message, '😴')}`))
      .catch(console.error);

    return true;
  }
};
