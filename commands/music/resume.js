const { embedMessage } = require(`../../libs/general/embedMessage`);
const { musicPermissions } = require(`../../libs/music/musicPermissions`);
const { IRUMIN_TUCC, IRUMIN_SMUG } = require(`../../config/config.json`);

module.exports = {
  name: `resume`,
  aliases: [`re`],
  category: `music`,
  description: `I'll resume whatever you were listening. It's that simple! \n\n **COMMAND LIST:** \n \`!resume\``,
  async execute (message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue)
      return message.channel.send(
        embedMessage(
          `We're back!`,
          `Eh? There's nothing playing ${IRUMIN_TUCC ? IRUMIN_TUCC : ``}`
        )
      );

    if (!musicPermissions(message)) return;

    if (!queue.playing) {
      queue.playing = true;
      queue.connection.dispatcher.resume();
      return message.channel
        .send(
          embedMessage(
            `We're back!`,
            `With more just for you, thanks to our sponsor ${message.author} for the quick break`
          )
        )
        .catch(console.error);
    }

    return message.channel
      .send(
        embedMessage(
          `We're back!`,
          `Or we would be if there was something playing ${
            IRUMIN_SMUG ? IRUMIN_SMUG : ``
          }`
        )
      )
      .catch(console.error);
  },
};
