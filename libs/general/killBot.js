const { Client } = require('discord.js');

/**
 * @param {Client} client
 */
function killBot(client) {
  if (!client || !(client instanceof Client)) return;

  client.destroy();
  process.exit(0);
}

module.exports = killBot;
