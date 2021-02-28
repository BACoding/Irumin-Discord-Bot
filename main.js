const { Client } = require('discord.js');
const requireOrFallback = require('./libs/general/require-or-fallback');
const botMsg = require("./libs/general/botMessages");
const killBot = require('./libs/general/killBot');
const loadCommands = require('./libs/general/loadCommands');
const { getEmojiOrFallback } = require('./libs/general/emojiUtils');

const { TOKEN } = requireOrFallback('./config/auth.json', './config/auth_example.json');
const { PREFIX, CLEAR_USER_MSG } = requireOrFallback('./config/config.json', './config/config.example.json');

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
client.on(`warn`, console.warn);
client.on(`error`, console.error);

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

// Ctrl+C handling (kill the bot gracefully)
process.on('SIGINT', () => killBot(client));
// handles `kill` or VSCode Debug Runner
process.on('SIGTERM', () => killBot(client));
