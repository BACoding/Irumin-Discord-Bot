const { Client, VoiceChannel, Guild } = require('discord.js');

/**
 * Disconnect bot from voice channel
 * @param {Client} client
 * @param {Guild} [guild=null]
 */
function leaveVoice(client, guild) {
  /**
   * @type {Map<string, {channel: VoiceChannel}}
   */
  const queue = client.queue;
  if (!queue) return;
  if (guild instanceof Guild)
    return queue.get(guild.id)?.channel?.leave();
  queue.forEach(serverQueue => serverQueue.channel?.leave());
}

/**
 * @param {Client} client
 */
function killBot(client) {
  if (client && ('destroy' in client)) {
    leaveVoice(client);
    client.destroy();
  }
  console.debug('Bye!');
  process.exit(0);
}

module.exports = { killBot, leaveVoice };
