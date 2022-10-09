const { musicPermissions } = require(`../../libs/music/musicPermissions`);
const { embedMessage } = require(`../../libs/general/embedMessage`);

module.exports = {
  name: `skip`,
  aliases: [`s`],
  category: `music`,
  description: `Thou hast the power of time skip. It's like it didn't even play! \n\n **COMMAND LIST:** \n \`!skip\``,
  execute (message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue)
      return message.channel
        .send(
          embedMessage(
            `Let's change things up!`,
            `Or not... There's nothing playing right now.`
          )
        )
        .catch(console.error);

    if (!musicPermissions(message)) return;

    queue.playing = true;
    queue.connection.dispatcher.end();
    message.channel
      .send(
        embedMessage(
          `Let's change things up!`,
          `Just skipped **${queue.songs[0].title}**. \n Hope you're happy ${message.author}! hehe`
        )
      )
      .catch(console.error);
  },
};
