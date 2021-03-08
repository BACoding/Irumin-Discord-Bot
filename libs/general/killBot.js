const { Client, VoiceConnection } = require('discord.js');

/**
 * @param {Client} client
 */
function killBot(client) {
  if (client && ('destroy' in client)) {
    /**
     * @type {Map<string, {connection: VoiceConnection}}
     */
    const queue = client.queue;
    if (queue && queue.size) {
      queue.forEach(serverQueue => {
        if (!serverQueue.connection) return;
        serverQueue.connection.disconnect();
      });
    }
    client.destroy();
  }
  console.debug('Bye!');
  process.exit(0);
}

module.exports = killBot;
