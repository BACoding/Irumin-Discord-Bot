//------------------------
//IMPORT MAIN DISCORD / YOUTUBE LIBRARIES
const { Message } = require('discord.js');
const ytdl = require("ytdl-core");
const YouTubeAPI = require("simple-youtube-api");
const { SpotifyBackend } = require('../../libs/music/spotify');

//------------------------
//IMPORT MAIN CODE LIBRARIES
const { play } = require("../../libs/music/playFunc");
const { playlist } = require("../../libs/music/playlistFunc");
const botMsg = require("../../libs/general/botMessages");

//------------------------
//IMPORT CONFIG
const { MUSICROOM_ID, CHECK_USER_VC, DEFAULT_VOLUME, PREFIX } = require("../../config/config.json");
const { YOUTUBE_API } = require("../../config/auth.json");

const youtube = new YouTubeAPI(YOUTUBE_API);
const spotify = new SpotifyBackend();

module.exports = {
  name: "play",
  aliases: ["p", "paly", "toca"],
  category: "music",
  get description() {
    let desc = [
      'Play description insert!\n',
      '**COMMAND LIST:**',
      `\`${PREFIX}${this.name} YOUTUBELINK\``
    ];
    if (spotify.available)
      desc.push(`\`${PREFIX}${this.name} https://open.spotify.com/track/7APqG5ONvBSYS4IJcS6Iwo\``,
        `\`${PREFIX}${this.name} spotify:track:7APqG5ONvBSYS4IJcS6Iwo\``);
    return desc.join('\n');
  },
  /**
   * @param {Message} message
   * @param {string[]} args
   */
  async execute(message, args) {
    //------------------------
    //DISCORD VALIDATIONS
    let channel = message.member.voice.channel;

    if(!channel) {
      channel = message.guild.channels.cache.find(channel => channel.id === MUSICROOM_ID);
      if (!channel)
        return message.channel.send(`User is not in a voice channel and bot's music room does not exist.`).catch(console.error)
    }

    const guildQueue = message.client.queue.get(message.guild.id);

    if(CHECK_USER_VC){
      if (!channel)
        return message.channel.send(botMsg.userActivity(message.member.id)).catch(console.error);

      if (guildQueue && channel !== message.guild.me.voice.channel)
        return message.channel.send(botMsg.userActivity(message.member.id)).catch(console.error);
    }

    if (!args.length)
      return message.channel.send(botMsg.emptyCommand(message.member.id)).catch(console.error);

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK"))
      return message.channel.send(botMsg.botPermissions()).catch(console.error);

    //------------------------
    //MUSIC PLAYER INIT
    let search = args.join(' ');
    let url = args[0];

    const isYTUrl = (url) => url.startsWith('http') && (new URL(url).host.endsWith('youtube.com') || new URL(url).host === 'youtu.be');
    const isYTPlaylist = (url) => url.startsWith('http') && new URL(url).searchParams.has('list') && new URL(url).pathname === '/playlist' ||
      url.includes('/playlist?list=')
    const isSpotifyUrl = (url) => spotify.parse(url).type !== 'invalid' && spotify.available;

    //------------------------
    //GO TO PLAYLIST "playlistFunc.js" IF A PLAYLIST WAS PROVIDED AS THE URL
    if (isYTPlaylist(url))
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
      volume: DEFAULT_VOLUME,
      playing: true
    };

    let songInfo = null;
    let song = {
      title: '',
      url: '',
      duration: 0,
      requester: message.author
    }

    if (isSpotifyUrl(url)) {
      try {
        let spotifySongInfo = await spotify.getInfo(url);
        if (spotifySongInfo.length) {
          let spotifySong = spotifySongInfo.shift();
          search = `${spotifySong.name} ${spotifySong.artist}`;
        }
      } catch (error) {
        console.error('spotify backend failed:', error);
        return message.channel.send(botMsg.invalidUrl(message.member.id)).catch(console.error);
      }
    }
    if (!isYTUrl(url) && !search.trim().startsWith('http')) {
      try {
        url = (await youtube.searchVideos(search, 1))[0].url;
      } catch (error) {
        console.error('youtube search failed:', error);
        return message.channel.send(botMsg.invalidUrl(message.member.id)).catch(console.error);
      }
    }

    if (isYTUrl(url)) {
      try {
        songInfo = await ytdl.getInfo(url);
        song.title = songInfo.videoDetails.title;
        song.url = songInfo.videoDetails.video_url;
        song.duration = songInfo.videoDetails.lengthSeconds;
      } catch (error) {
        console.log('getting youtube url failed:', error)
        return message.channel.send(botMsg.invalidUrl(message.member.id)).catch(console.error);
      }
    }

    if (!song || !song.url) {
      console.error(args, song);
      return message.channel.send(botMsg.invalidUrl(message.member.id)).catch(console.error);
    }

    if (guildQueue) {
      guildQueue.songs.push(song);
      return guildQueue.textChannel.send(botMsg.songAdded(song.requester, song.title)).catch(console.error);
    }

    queueConstruct.songs.push(song);
    message.client.queue.set(message.guild.id, queueConstruct);

    try {
      queueConstruct.connection = await channel.join();
      play(queueConstruct.songs[0], message);
    } catch (error) {
      console.error(error);
      message.client.queue.delete(message.guild.id);
      channel.leave();
      return message.channel.send(botMsg.botError(message.member.id)).catch(console.error);
    }
  }
}
