const { Message } = require('discord.js')
const { leaveVoice } = require('../../libs/general/killBot');

module.exports = {
  name: "leave",
  aliases: ["shutup"],
  category: "general",
  description: "Makes me leave the voice channel.",
  /**
   * @param {Message} message
   */
  execute({client, guild}) {
    if (!client.queue.has(guild.id)) return;
    leaveVoice(client, guild);
  }
};
