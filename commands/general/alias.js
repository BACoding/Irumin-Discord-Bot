const { Message } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { codifyCommand } = require('../../libs/general/emojiUtils');

module.exports = {
  name: "alias",
  aliases: [],
  category: "general",
  description: "Create alias for existing command.\n\n**Example**\n`!alias slap 🖐️`",
  /**
   * @param {Message} message
   */
  execute(message, args) {
    const prefix = message.client.prefix;
    let [command, alias] = args.slice(0, 2).map(a => String(a).toLowerCase());
    let existingCommand = message.client.commands.get(command);
    if (!existingCommand) {
      message.channel.send(`\`${prefix}${command}\` does not exist`);
      return;
    }
    let existingAliasCommand = message.client.commands.find(cmd =>
      Array.isArray(cmd.aliases) && cmd.aliases.includes(alias));
    if (existingAliasCommand) {
      message.channel.send(`\`${prefix}${existingAliasCommand.name}\` already uses alias ${codifyCommand(`${prefix}${alias}`)}`);
      return;
    }

    existingCommand.aliases.push(alias);

    message.channel.send(`Added alias ${codifyCommand(`${prefix}${alias}`)} to ${codifyCommand(`${prefix}${command}`)}`);

    let customAliases;
    try {
      customAliases = require('../../config/customAlias.json');
    } catch (e) { customAliases = {}; }
    if (!customAliases[command]) customAliases[command] = [];
    customAliases[command].push(alias);

    fs.writeFileSync(path.join(__dirname, '../../config/customAlias.json'), JSON.stringify(customAliases));
  }
};
