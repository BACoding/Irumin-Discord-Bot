//------------------------
//IMPORT EMBED FUNCTION AND EMOJIS
const { embedMessage } = require("./embedMessage");
const { IRUMIN_EMOJIS } = require("../../config/config.json");

//------------------------
//EMBED MESSAGE PARAMETER IS COMPOSED OF (`TITLE`,`MESSAGE`)
//TO ADD A USER IT NEEDS TO BE <@${message.member.id}> THIS
//[message.author.avatarURL()] GIVES YOU USER AVATAR;
//[message.client.user.avatarURL()] GIVES YOU BOT AVATAR;

module.exports = {
  helpMain(bot, helpList, version){
    return embedMessage(`IRUMIN | HOW TO USE`, `Try typing \`!help [with command]\` for more info.`, helpList, ``, `IRUMIN ${version}`, bot.avatarURL())
  },
  helpError(user){
    return embedMessage(`IRUMIN | HOW TO USE`, `Eh? I can't find that anywhere... Are you sure that exists or do you need \`!help\`?`, ``, ``, `${user.username}`, user.avatarURL());
  },
  helpCommand(user, command, prefix){
    return embedMessage(`IRUMIN | HOW TO USE [ ${prefix + command.name.toUpperCase()} ]`, command.description, '', command.image, ``, command.aliases.length >= 1 ? `• You can also use [ ${prefix + command.aliases} ]` : '')
  },
  invalidCommand() {
    return embedMessage(`INVALID COMMAND`, `That command doesn't exist. Check !help for a list of the available commands.`);
  },
  botPermissions() {
    return embedMessage(`Hellooo?`, `Knock knock... I don't have enough permissions <('.'<)`);
  },
  userActivity(users) {
    return embedMessage(`MIA`, `I don't see you anywhere <@${users}>`);
  },
  emptyCommand() {
    return embedMessage(`ERR ORDERS?!`, `You didn't send anything`);
  },
  botError() {
    return embedMessage(`Something Something`, `Something wrong happened...`);
  },
  emptyQueue() {
    return embedMessage(`WHERE DA SONG AT`, `THE QUEUE IS CURRENTLY EMPTY`);
  },
  invalidUrl(message) {
    return embedMessage(`INVALID URL`, `THAT SHIT DOESN'T WORK`);
  },
  songAdded(user, songName, songLink) {
    return embedMessage(`PLAYING SOON`, `**${songName}** was added to the queue!`, ``, ``, `${user.username}`, user.avatarURL());
  },
  nowPlaying(user, song) {
    return embedMessage(`NOW PLAYING`, `**${song.title}**`, ``, ``, `${user.username}`, user.avatarURL());
  },
  queueFinish(bot) {
    return embedMessage(`SHOW'S OVER`, `You're all free now!`, ``, ``, `${bot.username}`, bot.avatarURL());
  },
  messagesDeleted(message, msgCleaned) {
    let qtyString = 'messages';

    if(msgCleaned === 1)
      qtyString = 'message';

    return embedMessage(`PURGE`, `something something just obliterated ${msgCleaned} ${qtyString}`)
  }
}