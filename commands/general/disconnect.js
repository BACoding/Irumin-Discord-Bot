const {
  authorPermissions,
  goodbye,
} = require(`../../libs/general/botMessages`);
const killBot = require(`../../libs/general/killBot`);
const { OWNER_ID } = require(`../../config/auth.json`);

module.exports = {
  name: `disconnect`,
  aliases: [`quit`, `fuckoff`, `kill`, `ko`],
  category: `general`,
  description: `Closes the bot. Only the guild/bot owner can use this.`,
  /**
   * @param {Message} message
   */
  execute (message) {
    if (
      message.author.id !== message.guild.ownerID &&
      message.author.id !== OWNER_ID
    ) {
      message.channel.send(authorPermissions());
      return;
    }

    message.channel
      .send(goodbye())
      .then((msg) => msg.delete({ timeout: 3000 }))
      .then(() => killBot(message.client));
  },
};
