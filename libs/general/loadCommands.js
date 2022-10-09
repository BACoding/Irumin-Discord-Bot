const fs = require(`fs`);
const path = require(`path`);

const { Client, Collection } = require(`discord.js`);
const { COMMANDFOLDER = `commands` } = require(`../../config/config.json`);
const IRUMIN_ROOT = path.join(__dirname, `../..`);

/**
 * @param {Client} client
 */
function loadCommands (client) {
  if (!client || !(client instanceof Client)) return false;

  if (!client.commands) client.commands = new Collection();
  let customAliases;
  try {
    delete require.cache[`../../config/customAlias.json`];
    customAliases = require(`../../config/customAlias.json`);
  } catch (e) {
    customAliases = {};
  }

  recursiveRequire(COMMANDFOLDER).forEach((commandPath) => {
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
  console.log(`Loaded commands:\n`, client.commands.keys());
  return true;
}

/**
 * Find Command using name or alias
 * @param {Client} client
 * @param {string} commandName
 * @returns {import('../../commands/general/help').Command|null}
 */
function findCommand (client, commandName) {
  if (
    !(client instanceof Client) ||
    !client.commands ||
    typeof commandName !== `string`
  )
    return null;

  return (
    client.commands.find(
      (cmd) =>
        commandName === cmd.name ||
        commandName.toLowerCase() === cmd.name.toLowerCase()
    ) || findCommandAlias(client, commandName)
  );
}

function findCommandAlias (client, aliasName) {
  if (
    !(client instanceof Client) ||
    !client.commands ||
    typeof aliasName !== `string`
  )
    return null;

  return client.commands.find(
    (cmd) =>
      Array.isArray(cmd.aliases) &&
      cmd.aliases.some(
        (a) => a === aliasName || a.toLowerCase() === aliasName.toLowerCase()
      )
  );
}

function recursiveRequire (baseDirectory = COMMANDFOLDER, pattern = `.+\.js`) {
  let root = path.join(IRUMIN_ROOT, baseDirectory);
  return fs.readdirSync(root).reduce((files, p) => {
    let filePath = path.join(baseDirectory, p);
    let absPath = path.join(IRUMIN_ROOT, filePath);
    if (fs.statSync(absPath).isDirectory())
      files.push(...recursiveRequire(filePath, pattern));
    else if (new RegExp(pattern).test(p)) files.push(filePath);
    return files;
  }, []);
}

module.exports = { loadCommands, findCommand, findCommandAlias };
