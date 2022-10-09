const { embedMessage } = require(`../../libs/general/embedMessage`);
const { musicPermissions } = require(`../../libs/music/musicPermissions`);
const { IRUMIN_TUCC } = require(`../../config/config.json`);

module.exports = {
  name: `stop`,
  aliases: [],
  category: `music`,
  description: `I can wrap up everything in one go, delete everything! All this power on my fingertips! \n\n **COMMAND LIST:** \n \`!stop\``,
  execute (message) {
    const queue = message.client.queue.get(message.guild.id);

    if (!queue)
      return message.channel
        .send(
          embedMessage(
            `Wrapping up...`,
            `There's nothing going on? ${IRUMIN_TUCC ? IRUMIN_TUCC : ``}`
          )
        )
        .catch(console.error);

    if (!musicPermissions(message)) return;

    queue.songs = [];
    queue.connection.dispatcher.end();
    return;
  },
};
