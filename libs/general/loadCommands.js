const fs = require('fs');
const path = require('path');

const { Client, Collection } = require('discord.js');
const { COMMANDFOLDER='commands' } = require('../../config/config.json');
const IRUMIN_ROOT = path.join(__dirname, '../..');

/**
 * @param {Client} client
 */
function loadCommands(client) {
  if (!client || !(client instanceof Client)) return false;

  if (!client.commands) client.commands = new Collection();
  let customAliases;
  try {
    delete require.cache['../../config/customAlias.json'];
    customAliases = require('../../config/customAlias.json');
  } catch (e) { customAliases = {}; };

  recursiveRequire(COMMANDFOLDER).forEach(commandPath => {
    try {
      delete require.cache[path.join(IRUMIN_ROOT, commandPath)];
      let command = require(path.join(IRUMIN_ROOT, commandPath));
      client.commands.set(command.name, command);
      if (customAliases[command.name]) {
        if (!Array.isArray(command.aliases)) command.aliases = [];
        command.aliases.push(...customAliases[command.name]);
      }
    } catch {
      console.error(`Failed loading command ${commandPath}`);
    }
  });
  console.log('Loaded commands:\n', client.commands.keyArray())
  return true;
}

function recursiveRequire(baseDirectory=COMMANDFOLDER, pattern='.+\.js') {
  let root = path.join(IRUMIN_ROOT, baseDirectory)
  return fs.readdirSync(root)
    .reduce((files, p) => {
      let filePath = path.join(baseDirectory, p);
      let absPath = path.join(IRUMIN_ROOT, filePath);
      if (fs.statSync(absPath).isDirectory())
        files.push(...recursiveRequire(filePath, pattern));
      else if (new RegExp(pattern).test(p))
        files.push(filePath);
      return files;
    }, [])
}

module.exports = loadCommands;
