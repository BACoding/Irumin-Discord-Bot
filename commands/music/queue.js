const { embedMessage } = require("../../libs/general/embedMessage");
const { convertMs, convertSeconds } = require("../../libs/general/timeConvert");
const { QUEUE_LIMIT, IRUMIN_TATAKAI, IRUMIN_TUCC } = require("../../config/config.json")

module.exports = {
    name: "queue",
    aliases: ["q"],
    category: "music",
    description: "You can see my current set, up to 10 songs! \n\n **COMMAND LIST:** \n \`!queue\`",
    async execute(message) {
      const serverQueue = message.client.queue.get(message.guild.id);
      if (!serverQueue) return message.channel.send(embedMessage(`So what do we have today...`,`Eeeeh? There's nothing playing ${IRUMIN_TUCC ? IRUMIN_TUCC : ''}`));

      let queueString = [];

      for (const [index, song] of serverQueue.songs.entries()) {
        songNumber = index + 1;
        if (songNumber === 1) {
          queueString.push(`**${songNumber}. [${song.title}](${song.url}) [[${convertMs(serverQueue.connection.dispatcher.streamTime)}](${song.url}&t=${Math.round(serverQueue.connection.dispatcher.streamTime/1000)}) / ${convertSeconds(song.duration)}]**`);
        } else if (songNumber === QUEUE_LIMIT) {
          queueString.push(`**Stay tunned there's more! This is HateGrooves FM! Can't stop won't stop** ${IRUMIN_TATAKAI ? IRUMIN_TATAKAI : ''}`);
          break; 
        }else{
          queueString.push(`${songNumber}. [${song.title}](${song.url}) [${convertSeconds(song.duration)}]`);
        }
      }

      return message.channel.send(embedMessage(`Haaaai mina-san! This is our playlist for today :headphones:`, queueString));
  }
}