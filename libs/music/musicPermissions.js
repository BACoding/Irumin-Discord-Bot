const { embedMessage } = require(`../../libs/general/embedMessage`);
const { getEmojiOrFallback } = require(`../general/emojiUtils`);

module.exports = {
  /**
   * @param {Message} message
   */
  musicPermissions (message) {
    const userChannel = message.member.voice?.channelID;
    const botChannel = message.member.guild.voice?.channelID;

    if (userChannel !== botChannel)
      return message.channel
        .send(
          embedMessage(
            `WHERE ARE YOU?`,
            `I need you with me <@${
              message.member.id
            }>, together in voice! ${getEmojiOrFallback(message, `😴`)}`
          )
        )
        .catch(console.error);

    return true;
  },
};
