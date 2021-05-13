const { Message, MessageEmbed } = require('discord.js');
const magnet = require('magnet-uri');
const { URLSearchParams } = require('url');
const { default: fetch } = require('node-fetch');

module.exports = {
  name: 'magnet',
  aliases: ['m'],
  category: "general",
  description: "Parse magnet into link",
  /**
   * @param {Message} message
   * @param {string[]} parameters
   */
  execute(message, [url]) {
    if (!url || !url.startsWith('magnet:')) {
      message.channel.send('Invalid magnet link.');
      return;
    }

    const parsed = magnet.decode(url);

    fetch('https://c.tsu.re', {
      method: 'POST',
      body: new URLSearchParams({shorten: url}),
      mode: 'cors'
    })
    .then(r => {
      return r.text();
    })
    .then(d => {
      console.log(d);
      const msg = new MessageEmbed()
        .setAuthor(message.author.username)
        .setTitle(parsed.name)
        .setURL(d)
      message.channel.send({embed: msg});
    });
  }
};
