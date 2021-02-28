const { Message } = require("discord.js");
const requireOrFallback = require("./require-or-fallback");

const emojiIdRegex = /<?(?<animated>a)?:(?<name>[^:]+):(?<id>\d+)?>?/;
const guildEmojiRegex = /(<a?:[^:]+:\d+>)/;
const { IRUMIN_EMOJIS } = requireOrFallback('./config/config.json',
  './config/config.example.json');

function parseEmoji (str) {
  const groups = emojiIdRegex.exec(str)?.groups ?? {};
  return {
    animated: !!groups.animated,
    name: groups.name,
    id: groups.id,
    identifier: `${groups.animated ?? ''}${groups.name ?? ''}${groups.id ? `:${groups.id}` : ''}`
  };
}

function getEmojiOrFallback (message, key='🤖') {
  if (!(message instanceof Message) || !(key in IRUMIN_EMOJIS))
    return key;
  const { name, id } = parseEmoji(IRUMIN_EMOJIS[key]);
  const foundEmojis = message.client.emojis.cache.filter(e => e.id === id || e.name === name);
  const emojiInCurrentGuild = foundEmojis.find(e => e.guild.id === message.guild.id);

  return emojiInCurrentGuild || foundEmojis.first() || key;
}

function codifyCommand (commandName) {
  return commandName
    .split(guildEmojiRegex)
    .filter(s => s !== '')
    .map(s => !guildEmojiRegex.test(s) ? `\`${s}\`` : s)
    .join('');
}

module.exports = { parseEmoji, getEmojiOrFallback, codifyCommand }
