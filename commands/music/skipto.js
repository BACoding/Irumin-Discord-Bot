const { musicPermissions } = require("../../libs/music/musicPermissions");
const { embedMessage } = require("../../libs/general/embedMessage");

module.exports = {
  name: "skipto",
  aliases: ["st"],
  category: "music",
  description: "Skip to the selected queue number",
  execute(message, args) {
    if (!args.length || isNaN(args[0]))
      return message.channel.send(`Usage: ${message.client.prefix}${module.exports.name} <Queue Number>`).catch(console.error);

    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("There is no queue.").catch(console.error);
    if (!musicPermissions(message.member)) return;
    if (args[0] > queue.songs.length)
      return message.reply(`The queue is only ${queue.songs.length} songs long!`).catch(console.error);

    queue.playing = true;

    if (queue.loop) {
      for (let i = 0; i < args[0] - 2; i++) {
        queue.songs.push(queue.songs.shift());
      }
    } else {
      queue.songs = queue.songs.slice(args[0] - 2);
    }
    
    queue.connection.dispatcher.end();
    queue.textChannel.send(`${message.author} ⏭ skipped ${args[0] - 1} songs`).catch(console.error);
  }
};