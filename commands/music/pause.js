const { embedMessage } = require(`../../libs/general/embedMessage`);
const { musicPermissions } = require(`../../libs/music/musicPermissions`);
const { IRUMIN_TUCC } = require(`../../config/config.json`);

module.exports = {
  name: `pause`,
  aliases: [`ps`],
  category: `music`,
  description: `Need a quick break? Need to use the bathroom? No problem! I got you covered \n\n **COMMAND LIST:** \n \`!pause\``,
  async execute (message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue)
      return message.channel
        .send(
          embedMessage(
            `Let's stop for a second`,
            `Eh? There's nothing playing ${IRUMIN_TUCC ? IRUMIN_TUCC : ``}`
          )
        )
        .catch(console.error);

    if (!musicPermissions(message)) return;

    if (queue.playing) {
      queue.playing = false;
      queue.connection.dispatcher.pause(true);
      return message.channel
        .send(
          embedMessage(
            `Let's stop for a second`,
            `Stay tunned after this quick break sponsored by ${message.author}`
          )
        )
        .catch(console.error);
    }
  },
};
