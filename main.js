const { TOKEN } = require(`./config/auth.json`);
const {
  PREFIX='!',
  IRUMIN_EMOJIS={},
  CLEAR_USER_MSG=true
} = require('./config/config.json');
const botMsg = require("./libs/general/botMessages");
const { Client } = require(`discord.js`);
const killBot = require('./libs/general/killBot');
const loadCommands = require('./libs/general/loadCommands');

const emojiIdRegex = /(?:<:)(?<animated>a:)?(?<name>[^:]+):?(?<id>[^:]+)?/;

//------------------------
//BOT INITIALIZATION
const client = new Client({ disableMentions: `everyone` });
client.login(TOKEN);
client.prefix = PREFIX;
client.queue = new Map();

client.on(`ready`, () => {
  loadCommands(client);
  console.log(`${client.user.username} bot is ready!`);
  client.user.setActivity(`with her hair`);
});
client.on(`warn`, (info) => console.log(info));
client.on(`error`, console.error);

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
  const command = client.commands.find(cmd =>
    commandName === cmd.name.toLowerCase() ||
    (cmd.aliases && cmd.aliases.includes(commandName)));

  if (!command) {
    message.channel.send(botMsg.invalidCommand(commandName)).catch(console.error);
    return;
  }

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
