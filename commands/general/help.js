const { PREFIX } = require('../../config/config.json');
const { version } = require('../../package.json');
const botMsg = require('../../libs/general/botMessages');

module.exports = {
  name: 'help',
  aliases: ['h'],
  category: 'general',
  description: '',
  execute(message, args) {
    let commands = message.client.commands.array();
    let helpList = [];

    if (args.length === 0) {
      commands.forEach(function (item) {
        if (item.name !== 'help') {
          let helpCmd = helpList.find((i) => i.name === item.category);

          if (!helpCmd) {
            let newHelpCmd = {
              name: item.category,
              value: ['`' + PREFIX + item.name + '`'],
              inline: false
            };

            helpList.push(newHelpCmd);
          } else {
            helpCmd.value.push('`' + PREFIX + item.name + '`');
          }
        }
      });

      return message.channel.send(botMsg.helpMain(message.client.user, helpList, version));
    } else {
      let command = commands.find((e) => e.name === args[0] || e.aliases[0] === args[0]);

      if (!command) return message.channel.send(botMsg.helpError(message.author));

      return message.channel.send(botMsg.helpCommand(message.author, command, PREFIX));
    }
  }
};
