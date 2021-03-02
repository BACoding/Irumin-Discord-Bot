const ytdlDiscord = require("ytdl-core-discord");
const botMsg = require("../../libs/general/botMessages");

module.exports = {
  async play(song, message) {
    const queue = message.client.queue.get(message.guild.id);
    
    if (!song) {
      //queue.channel.leave();
      message.client.queue.delete(message.guild.id);
      queue.connection.client.user.setActivity(`with her hair`);

      return queue.textChannel.send(botMsg.queueFinish(message.client.user));
    }

    let stream = null;
    let streamType = song.url.includes("youtube.com") ? "opus" : "ogg/opus";

    try {
      if (song.url.includes("youtube.com"))
        stream = await ytdlDiscord(song.url, { filter: 'audioonly', quality: 'highestaudio', highWaterMark: 1 << 25 });
    } catch (error) {
      if (queue) {
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      }
      
      return message.channel.send(botMsg.botError());
    }

    queue.connection.on("disconnect", () => message.client.queue.delete(message.guild.id));

    const dispatcher = queue.connection
    .play(stream, { type: streamType })
    .on("start", ()=> {
      queue.textChannel.send(botMsg.nowPlaying(song.requester, song));
      queue.connection.client.user.setActivity(song.title);
    })
    .on("finish", () => {
      if (queue.loop) {
        // if loop is on, push the song back at the end of the queue
        // so it can repeat endlessly
        let lastSong = queue.songs.shift();
        queue.songs.push(lastSong);
        module.exports.play(queue.songs[0], message);
      } else {
        // Recursively play the next song
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      }
    })
    .on("error", (err) => {
      console.error(err);
      queue.songs.shift();
      module.exports.play(queue.songs[0], message);
    });

    dispatcher.setVolumeLogarithmic(queue.volume / 100);
  }
};