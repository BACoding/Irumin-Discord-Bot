const { Message } = require('discord.js');
const { default: fetch } = require('node-fetch');
const { W2G_API_KEY } = require('../../config/auth.json');

module.exports = {
  name: 'watch',
  aliases: ['w2g'],
  category: "general",
  description: "Create room in watch2gether.",
  /**
   * @param {Message} message
   */
  execute(message, [url]) {
    fetch('https://w2g.tv/rooms/create.json', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        w2g_api_key: W2G_API_KEY,
        share: url ?? "https://www.youtube.com/watch?v=WxIr_-JVyaw",
        bg_color: "FF0000",
        bg_opacity: "50",
      })
    })
    .then(r => {
      console.log(r)
      return r.json()
    })
    .then(d => {
      console.log(d);
      message.channel.send(`Room created at https://w2g.tv/rooms/${d.streamkey}`);
    })
  }
};
