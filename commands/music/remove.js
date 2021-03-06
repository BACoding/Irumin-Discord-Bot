const { musicPermissions } = require("../../libs/music/musicPermissions");

module.exports = {
  name: "remove",
  aliases: ["rm"],
  category: "music",
  description: "In case you don't like what's coming up next, remove an upcoming song from the queue! \n\n **COMMAND LIST:** \n \`!remove [song number]\`",
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);

    if (!queue) return message.channel.send("There is no queue.").catch(console.error);
    if (!musicPermissions(message)) return;

    if (!args.length) return message.reply(`Usage: ${message.client.prefix}remove <Queue Number>`);
    if (isNaN(args[0])) return message.reply(`Usage: ${message.client.prefix}remove <Queue Number>`);

    if (args[0] === '1') return message.client.commands.get("skip").execute(message).catch(console.error);

    let song = queue.songs.splice(args[0] - 1, 1);

    queue.textChannel.send(`**${song[0].title}** removed from the queue!.`);
  }
};
