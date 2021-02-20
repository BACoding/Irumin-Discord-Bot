const { TOKEN } = require(`./config/auth.json`);
const {
  COMMANDFOLDER='commands',
  PREFIX='!',
  IRUMIN_EMOJIS={},
  CLEAR_USER_MSG=true
} = require('./config/config.json');
const botMsg = require("./libs/general/botMessages");
const { readdirSync, statSync } = require(`fs`);
const { join } = require(`path`);
const { Client, Collection } = require(`discord.js`);

const COMMAND_NAMES = {};

const commandsPath = join(__dirname, COMMANDFOLDER);
const emojiIdRegex = /(?:<:)(?<name>[^:]+):?(?<id>[^:]+)?/;

//------------------------
//BOT INITIALIZATION
const client = new Client({ disableMentions: `everyone` });
client.login(TOKEN);
client.commands = new Collection();
client.prefix = PREFIX;
client.queue = new Map();

client.on(`ready`, () => {
  console.log(`${client.user.username} bot is ready!`);
  client.user.setActivity(`with her hair`);
});
client.on(`warn`, (info) => console.log(info));
client.on(`error`, console.error);

//------------------------
//IMPORT COMMAND
let getCommands = (dir) => {
  readdirSync(dir).forEach(function(file) {
    let filePath = join(dir, file);
    if (statSync(filePath).isDirectory())
      return getCommands(filePath);

    if (file.endsWith(`.js`)) {
      let command = require(filePath);
      client.commands.set(command.name, command);
      COMMAND_NAMES[command.name] = command.name;
      if (Array.isArray(command.aliases))
        command.aliases.forEach(a => COMMAND_NAMES[a] = command.name);
    }
  });
}
getCommands(commandsPath);

const getEmojiOrFallback = (message, key='🤖') => {
  if (!message || !key || !(key in IRUMIN_EMOJIS))
    return key;

  let name = IRUMIN_EMOJIS[key], id;
  if (emojiIdRegex.test(name)) {
    let res = emojiIdRegex.exec(name);
    if (res && res.groups) {
      name = res.groups.name;
      id = res.groups.id;
    }
  }
  return message.guild.emojis.cache.find(e => e.id === id || e.name === name) || key;
}

client.on(`message`, async (message) => {
  // ignore bot messages
  if (message.author.bot) return;
  // ignore own messages
  if (message.author.id === client.user.id) return;
  // ignore DMs
  if (!message.guild) return;
  // ignore unprefixed messages
  if (!String(message.content).trim().startsWith(PREFIX)) return;

  const args = message.content.trim().slice(PREFIX.length).split(/ +/);
  const commandName = args.shift().toLowerCase();
  if (!(commandName in COMMAND_NAMES) || !COMMAND_NAMES[commandName]) {
    message.channel.send(botMsg.invalidCommand(commandName)).catch(console.error);
    return;
  }
  const command = client.commands.find((cmd) =>
    commandName === cmd.name ||
    (cmd.aliases && cmd.aliases.includes(commandName)));

  try {
    command.execute(message, args);
    message.react(getEmojiOrFallback(message, '🤖'));
  } catch (error) {
    console.log(error);
    message.channel.send(botMsg.invalidCommand(commandName)).catch(console.error);
  } finally {
    if(CLEAR_USER_MSG && message.deletable)
      message.delete({timeout:10000}).catch(console.error);
  }
});
