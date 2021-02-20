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
    const me = message.client.user;
    message.channel.messages.fetch({limit: 100})
    .then(messages => messages.filter(msg => msg.deletable && msg.author.id === me.id))
    .then(ownMsgs => {
      if (message.channel.permissionsFor(me).has('MANAGE_MESSAGES'))
        return message.channel.bulkDelete(ownMsgs)
      return Promise.all(ownMsgs.map(msg => msg.delete())).then(res => new discord.Collection(res.filter(m => m.deleted)));
    })
    .then(deleted => {
      message.channel.send(botMsg.messagesDeleted(message.member.id, deleted.size)).catch(console.error)
    }).catch(e => {
      console.error(e);
      message.channel.send(botMsg.botError()).catch(console.error)
    });
  }
};