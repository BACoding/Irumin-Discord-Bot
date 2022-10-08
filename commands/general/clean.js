const botMsg = require('../../libs/general/botMessages');

module.exports = {
  name: 'clean',
  aliases: ['cln'],
  category: 'general',
  description: 'Clears all my messages',
  execute(message) {
    try {
      message.channel.messages.fetch({limit: 100}).then((messages) => {
        const botMessages = messages.filter((msg) => msg.author.bot);
        message.channel.bulkDelete(botMessages);
        message.channel.send(botMsg.messagesDeleted(message.member.id, botMessages.size)).catch(console.error);
      });
    } catch (error) {
      console.log(error);
    }

    return message.channel.send(botMsg.botError()).catch(console.error);
  }
};