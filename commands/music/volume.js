const { embedMessage } = require("../../libs/general/embedMessage");
const { musicPermissions } = require("../../libs/music/musicPermissions");
const { IRUMIN_TUCC } = require("../../config/config.json");

module.exports = {
  name: "volume",
  aliases: ["v"],
  category: "music",
  description: "Boost or lower the volume! \n\n **COMMAND LIST:** \n \`!volume [0-100]\`",
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);

    if (!queue)
        return message.channel.send(embedMessage(`Up! Down! It's all in the mind 🔊`,`But there's nothing going on so... ${IRUMIN_TUCC ? IRUMIN_TUCC : ``}`))
          .catch(console.error);

    if (!musicPermissions(message.member))
      return

    if (!args[0])
      return message.channel.send(embedMessage(`Up! Down! It's all in the mind 🔊`, `Volume is currently at **${queue.volume}%** power`))
        .catch(console.error);
      
    if (isNaN(args[0]))
      return message.channel.send(embedMessage(`Up! Down! It's all in the mind 🔊`, `Wait that's not a number!`))
        .catch(console.error);
      
    if (parseInt(args[0]) > 100 || parseInt(args[0]) < 0)
      return message.channel.send(embedMessage(`Up! Down! It's all in the mind 🔊`, `The volume only goes from 0 to 100!`))
        .catch(console.error);
      
      queue.volume = args[0];
      queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);
      return message.channel.send(embedMessage(`Up! Down! It's all in the mind 🔊`, `Volume is set to **${args[0]}%** power`))
        .catch(console.error);
  }
};