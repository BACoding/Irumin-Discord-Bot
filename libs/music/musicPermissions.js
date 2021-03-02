const { embedMessage } = require("../../libs/general/embedMessage");
const { IRUMIN_TUCC } = require("../../config/config.json");

module.exports = {
  musicPermissions(member) {
    const { channelID } = member.voice;
    const botChannel = member.guild.voice.channelID;

    if (channelID !== botChannel)
      return message.channel.send(embedMessage(`WHERE ARE YOU?`, `I need you with me <@${member.id}>, together in voice! ${IRUMIN_TUCC ? IRUMIN_TUCC : ''}`)).catch(console.error);

    return true;
  }
};