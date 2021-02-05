const { TOKEN } = require(`./config/auth.json`);
const botConfig = require(`./config/config.json`);
const botMsg = require("./libs/general/botMessages");
const { readdirSync, statSync } = require(`fs`);
const { join } = require(`path`);
const { Client, Collection } = require(`discord.js`);

const commandsPath = join(__dirname, botConfig.COMMANDFOLDER);
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
const whiteSpaceRegex = /^!\S/;

//------------------------
//BOT INITIALIZATION
const client = new Client({ disableMentions: `everyone` });
client.login(TOKEN);
client.commands = new Collection();
client.prefix = botConfig.PREFIX;
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
    let filePath = dir + `/` + file;
    if (statSync(filePath).isDirectory()) {
      getCommands(filePath);
    } else if(!statSync(filePath).isDirectory() && file.endsWith(`.js`)) {
      let command = require(filePath);
      client.commands.set(command.name, command);
    }
  });
}
getCommands(commandsPath);

client.on(`message`, async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  const prefixRegex = new RegExp(`^(${escapeRegex(botConfig.PREFIX)})\\s*`);

  if (!prefixRegex.test(message.content)) return;
  if (!whiteSpaceRegex.test(message.content)) return;
  
  const [matchedPrefix] = message.content.match(prefixRegex);
  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();;
  const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
  
  try {
    message.react(botConfig.IRUMIN_EMOJIS.IRUMIN_BOT);
    command.execute(message, args);

    if(botConfig.CLEAR_USER_MSG)
      message.delete({timeout:10000});
  } catch (error) {
    console.log(error);
    message.channel.send(botMsg.invalidCommand(message)).catch(console.error);

    if(botConfig.CLEAR_USER_MSG)
      message.delete({timeout:10000});
  }
});