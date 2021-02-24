const botMsg = require("../../libs/general/botMessages");
const discord = require('discord.js')

module.exports = {
  name: "clean",
  aliases: ["cln"],
  category: "general",
  description: "Cleans channel of all my messages",
  /**
   * @param {discord.Message} message
   */
  execute(message) {
    /**
     * @type discord.TextChannel
     */
    const channel = message.channel;
    const me = message.client.user;
    channel.messages.fetch({limit: 100})
    .then(messages => messages.filter(msg => msg.deletable && msg.author.id === me.id))
    .then(ownMsgs => {
      if (channel.permissionsFor(me).has('MANAGE_MESSAGES'))
        return channel.bulkDelete(ownMsgs).then(d => d.size);
      return Promise.all(ownMsgs.map(msg => msg.delete())).then(d => d.length);
    })
    .then(deleted => channel.send(botMsg.messagesDeleted(message.member.id, deleted)));
  }
};
