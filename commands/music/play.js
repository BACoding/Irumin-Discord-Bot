//------------------------
//IMPORT MAIN DISCORD / YOUTUBE LIBRARIES
const ytdl = require("ytdl-core");
const YouTubeAPI = require("simple-youtube-api");

//------------------------
//IMPORT MAIN CODE LIBRARIES
const { play } = require("../../libs/music/playFunc");
const { playlist } = require("../../libs/music/playlistFunc");
const botMsg = require("../../libs/general/botMessages");

//------------------------
//IMPORT CONFIG
const botConfig = require("../../config/config.json");
const { YOUTUBE_API } = require("../../config/auth.json");

const youtube = new YouTubeAPI(YOUTUBE_API);

module.exports = {
  name: "play",
  aliases: ["p", "paly", "toca"],
  category: "music",
  description: `Play description insert! \n\n **COMMAND LIST:** \n \`!play YOUTUBELINK\``,
  async execute(message, args) {
    //------------------------
    //DISCORD VALIDATIONS
    let channel = message.member.voice.channel;
    
    if(!channel) {
      channel = message.guild.channels.cache.find(channel => channel.id === botConfig.MUSICROOM_ID);
      if (!channel)
        return message.channel.send(`User is not in a voice channel and bot's music room does not exist.`).catch(console.error)
    }

    const serverQueue = message.client.queue.get(message.guild.id);

    if(botConfig.CHECK_USER_VC){
      if (!channel)
        return message.channel.send(botMsg.userActivity(message.member.id)).catch(console.error);
      
      if (serverQueue && channel !== message.guild.me.voice.channel)
        return message.channel.send(botMsg.userActivity(message.member.id)).catch(console.error);
    }
    
    if (!args.length)
      return message.channel.send(botMsg.emptyCommand(message.member.id)).catch(console.error);

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK"))
      return message.channel.send(botMsg.botPermissions()).catch(console.error);
    
    //------------------------
    //MUSIC PLAYER INIT
    const search = args.join(" ");
    const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
    const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
    const url = args[0];
    const urlValid = videoPattern.test(args[0]);

    //------------------------
    //GO TO PLAYLIST "playlistFunc.js" IF A PLAYLIST WAS PROVIDED AS THE URL
    if (!videoPattern.test(args[0]) && playlistPattern.test(args[0]))
      return playlist(message, args);
      //return message.client.commands.get("playlist").execute(message, args);

    //------------------------
    //START THE QUEUE WITH A SONG OR ADDS SONG TO CURRENT QUEUE
    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: botConfig.DEFAULT_VOLUME,
      playing: true
    };

    let songInfo = null;
    let song = null;
    
    if (urlValid) {
      try {
        songInfo = await ytdl.getInfo(url);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds,
          requester: message.author
        };
      } catch (error) {
        return message.channel.send(botMsg.invalidUrl(message.member.id)).catch(console.error);
      }
    } else {
      try {
        const results = await youtube.searchVideos(search, 1);

        songInfo = await ytdl.getInfo(results[0].url);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds,
          requester: message.author
        };
      } catch (error) {
        return message.channel.send(botMsg.invalidUrl(message.member.id)).catch(console.error);
      }
    }

    if (serverQueue) {
      serverQueue.songs.push(song);
      return serverQueue.textChannel.send(botMsg.songAdded(song.requester, song.title)).catch(console.error);
    }

    queueConstruct.songs.push(song);
    message.client.queue.set(message.guild.id, queueConstruct);

    try {
      queueConstruct.connection = await channel.join();
      play(queueConstruct.songs[0], message);
    } catch (error) {
      console.error(error);
      message.client.queue.delete(message.guild.id);
      await channel.leave();
      return message.channel.send(botMsg.botError(message.member.id)).catch(console.error);
    }
  }
}
