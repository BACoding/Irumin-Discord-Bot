const { Message } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { codifyCommand } = require('../../libs/general/emojiUtils');
const { findCommand, findCommandAlias } = require('../../libs/general/loadCommands');

const help = require('./help');

module.exports = {
  name: "alias",
  aliases: [],
  category: "general",
  description: "Create alias for existing command.\n\n**Example**\n`!alias slap 🖐️`",
  /**
   * @param {Message} message
   * @param {string[]} args
   */
  execute(message, [commandName, alias]=[]) {
    if (!commandName || !alias) return help.execute(message, [this.name]);

    const prefix = message.client.prefix;
    const command = findCommand(message.client, commandName);
    if (!command) {
      message.channel.send(`\`${prefix}${commandName}\` does not exist`);
      return;
    }

    const aliasCommand = findCommandAlias(message.client, alias);
    if (aliasCommand) {
      message.channel.send(`${codifyCommand(aliasCommand.name)} already uses alias ${codifyCommand(alias)}`);
      return;
    }

    command.aliases.push(alias);

    message.channel.send(`Added alias ${codifyCommand(alias)} to ${codifyCommand(commandName)}`);

    let customAliases;
    try {
      customAliases = require('../../config/customAlias.json');
    } catch (e) { customAliases = {}; }
    if (!customAliases[commandName]) customAliases[commandName] = [];
    customAliases[commandName].push(alias);

    fs.writeFileSync(path.join(__dirname, '../../config/customAlias.json'), JSON.stringify(customAliases));
  }
};
