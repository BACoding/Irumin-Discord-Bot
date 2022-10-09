const { Client, GatewayIntentBits } = require(`discord.js`);
const requireOrFallback = require(`./libs/general/require-or-fallback`);
const botMsg = require(`./libs/general/botMessages`);
const killBot = require(`./libs/general/killBot`);
const { loadCommands, findCommand } = require(`./libs/general/loadCommands`);
const { getEmojiOrFallback } = require(`./libs/general/emojiUtils`);

const { REST, Routes } = require(`discord.js`);

const { TOKEN, CLIENT_ID } = requireOrFallback(
  `./config/auth.json`,
  `./config/auth_example.json`
);
const { PREFIX, CLEAR_USER_MSG, ACTIVITY_QUOTE } = requireOrFallback(
  `./config/config.json`,
  `./config/config.example.json`
);

//------------------------
//BOT INITIALIZATION
const client = new Client({
  disableMentions: `everyone`,
  intents: [GatewayIntentBits.Guilds],
});
client.login(TOKEN);
client.prefix = PREFIX;
client.queue = new Map();

client.on(`ready`, () => {
  loadCommands(client);
  console.log(`${client.user.username} bot is ready!`);
  client.user.setActivity(`${ACTIVITY_QUOTE}`);
});
client.on(`warn`, console.warn);
client.on(`error`, console.error);

const commands = [
  {
    name: `fxTwitter`,
    type: 3,
  },
];

const rest = new REST({ version: `10` }).setToken(TOKEN);

(async () => {
  try {
    console.log(`Started refreshing application (/) commands.`);

    await rest.put(Routes.applicationCommands(CLIENT_ID), {
      body: commands,
    });

    console.log(`Successfully reloaded application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
})();

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
  const commandName = args.shift();
  const command = findCommand(client, commandName);

  if (!command) {
    message.channel
      .send(botMsg.invalidCommand(commandName))
      .catch(console.error);
    return;
  }

  try {
    command.execute(message, args.slice());
    message.react(getEmojiOrFallback(message, `🤖`));
  } catch (error) {
    console.log(error);
    message.channel
      .send(botMsg.invalidCommand(commandName))
      .catch(console.error);
  } finally {
    if (CLEAR_USER_MSG && message.deletable)
      message.delete({ timeout: 10000 }).catch(console.error);
  }
});

client.on(`interactionCreate`, async (interaction) => {
  if (!interaction.isMessageContextMenuCommand()) return;

  console.log(interaction.targetMessage.content);
  const url = interaction.targetMessage.content
    .split(` `)
    .filter((x) => x.includes(`https://twitter.com`));

  if (interaction.commandName === `fxTwitter`) {
    await interaction.reply({
      content: url[0].replace(`twitter`, `fxtwitter`),
      ephemeral: true,
    });
  }
});

// Ctrl+C handling (kill the bot gracefully)
process.on(`SIGINT`, () => killBot(client));
// handles `kill` or VSCode Debug Runner
process.on(`SIGTERM`, () => killBot(client));
