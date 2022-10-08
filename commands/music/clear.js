const { embedMessage } = require('../../libs/general/embedMessage');
const { musicPermissions } = require('../../libs/music/musicPermissions');
const { IRUMIN_TUCC } = require('../../config/config.json');

module.exports = {
  name: 'clear',
  aliases: ['c'],
  category: 'music',
  description: "Clears everything in queue... That's it really \n\n **COMMAND LIST:** \n `!clear`",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);

    if (!queue)
      return message.channel
        .send(embedMessage("Let's clear everything!", `There's nothing going on? ${IRUMIN_TUCC ? IRUMIN_TUCC : ''}`))
        .catch(console.error);

    if (!musicPermissions(message.member)) return;

    queue.songs.length = 1;

    return message.channel.send(embedMessage("Let's clear everything!", "We're ending the show after this song!")).catch(console.error);
  }
};
