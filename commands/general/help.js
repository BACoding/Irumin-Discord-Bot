const { embedMessage } = require("../../libs/general/embedMessage");
const { PREFIX, IRUMIN_CHA } = require("../../config/config.json");
const { Message } = require('discord.js');

/**
 * @typedef Command
 * @property {string} name - Command Name
 * @property {string[]} aliases - Aliases to Command, can be empty
 * @property {'general'|'messages'|'music'} category - Command category
 * @property {string} description - Command description
 * @property {Function} execute - Command behavior
 */

/**
 * @type Command
 */
module.exports = {
  name: "help",
  aliases: ["h", '?'],
  category: "general",
  description: "",
  /**
   * @param {Message} message
   * @param {string[]} args
   */
  execute(message, args) {
    /**
     * @type {Command[]}
     */
    let commands = message.client.commands.array();
    let subject = Array.isArray(args) && args.length ? args.shift() : null;
    let command = commands.find(e => e.name === subject || e.aliases.includes(subject));

    let title = 'IRUMIN | HOW TO USE' + (!command ? '' : `[ ${PREFIX+command.name.toUpperCase()} ]`),
        description = 'Try typing `!help [command]` for more info.',
        fields = [],
        image = '',
        footerText = 'IRUMIN v0.8',
        footerImage = message.client.user.avatarURL();


    if (!subject) {
      commands.forEach(item => {
        // ignore itself
        if (item.name === this.name) return;

        let helpCmd = fields.find(i => i.name === item.category);
        if (!helpCmd){
          helpCmd = { name: item.category, value: [], inline: false };
          fields.push(helpCmd);
        }

        helpCmd.value.push(`\`${PREFIX}${item.name}\``);
      });

    } else if (!command) {
      description = "Eh? I can't find that anywhere... Are you sure that exists or do you need \`!help\`?";

    } else {
      console.log(command.aliases);
      if (Array.isArray(command.aliases) && command.aliases.length)
        fields.push({name: 'Aliases', value: command.aliases.map(a => `\`${PREFIX}${a}\``), inline: false});
    }

    return message.channel.send(embedMessage(title, description, fields, image, footerText, footerImage));
  }
};