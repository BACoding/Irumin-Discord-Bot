const execa = require('execa');
const { createReadStream } = require('fs');
const path = require('path');

async function runYTDL(searchTerm, maxResults) {
  if (!searchTerm || !String(searchTerm)) return [];

  const args = [
    '--dump-single-json',
    '--default-search=ytsearch' + maxResults ?? 3,
    // if URL includes single video and playlist, only get info about the single video (explicit playlists)
    '--no-playlist',
    '--format=bestaudio[acodec=opus]/bestaudio[ext=opus]/bestaudio[ext=webm]/bestaudio[ext=ogg]/best'
  ];
  try {
    const { stdout } = await execa('youtube-dl', args.concat(searchTerm));
    const json = JSON.parse(stdout);
    const entries = json._type === 'playlist' ? json.entries : [json];
    return entries
      .map(({ webpage_url, title, url, duration, track, artist, album }) =>
        ({ webpage_url, title, url, duration, track, artist, album }));
  } catch (e) {
    console.error(e);
    return [];
  }
}
const download = async (url) => {
  const args = [
    '--no-playlist', url,
    '--format=bestaudio[acodec=opus]/bestaudio[ext=opus]/bestaudio[ext=webm]/bestaudio[ext=ogg]/best',
    '-o', path.join(__dirname, '../../cache', '%(extractor_key)s-%(id)s.%(ext)s')
  ];
  const dlpath = (await execa('youtube-dl', [...args, '--get-filename'])).stdout;
  await execa('youtube-dl', args);
  return dlpath;
}

const searchVideos = async (searchTerm, maxResults=1) => (await runYTDL(searchTerm, maxResults))
  .map(({webpage_url}) => ({url: webpage_url }))
  .slice(0, maxResults);

const getInfo = async (url) => (await runYTDL(url))
  .map(({title, webpage_url, duration, track, artist, album, url}) =>
    ({
      title,
      url,
      duration,
      // ytdl-core compatible result
      videoDetails: {
        title,
        video_url: webpage_url,
        lengthSeconds: duration,
        track, artist, album
      }
    }))
  .shift();

/*
const tests = ['pp6GyPH2TsY', 'wA1v207xlOw', 'ZE5zXLOyEOQ', 'tenet posterity'];
Promise.all(tests.map(searchVideos)).then(console.log)
 */
module.exports = { searchVideos, getInfo, download };
