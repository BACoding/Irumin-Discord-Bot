const SpotifyAPI = require('spotify-web-api-node');
const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = require('../../config/auth.json');

const OPEN_SPOTIFY_RE = /https:\/\/open.spotify.com\/(?<type>track|artist|album|playlist)\/(?<id>\w+)/
const SPOTIFY_URI_RE = /spotify:(?<type>track|artist|album|playlist):(?<id>\w+)/

class SpotifyBackend {
  constructor() {
    this.api = new SpotifyAPI({
      clientId: SPOTIFY_CLIENT_ID,
      clientSecret: SPOTIFY_CLIENT_SECRET
    });
  }
  expires = 0;

  async login() {
    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
      console.warn('Client Credentials not available. Cannot use Spotify Backend.');
      return false;
    }
    if (this.loggedIn) return true;
    const data = await this.api.clientCredentialsGrant();
    if (!data || !data.body?.access_token) {
      console.warn('Could not login to Spotify.');
      return false;
    }
    this.api.setAccessToken(data.body.access_token);
    this.expires = Date.now()/1000 + data.body.expires_in;
    return true;
  }

  get available() {
    return SPOTIFY_CLIENT_ID && SPOTIFY_CLIENT_SECRET;
  }
  get loggedIn() {
    return this.api.getAccessToken() !== undefined && this.expires >= Date.now();
  }

  parse(url) {
    let urlString = String(url), parsed;
    if (!urlString) return ret;
    if (OPEN_SPOTIFY_RE.test(urlString))
      parsed = OPEN_SPOTIFY_RE.exec(urlString)?.groups;
    if (SPOTIFY_URI_RE.test(urlString))
      parsed = SPOTIFY_URI_RE.exec(urlString)?.groups;
    return parsed ?? { type: 'invalid', id: '' };
  }

  async getAPIResult(type, id) {
    switch (type) {
      case 'track':
        return (await this.api.getTracks([id])).body.tracks;
      case 'album':
        return (await this.api.getAlbumTracks(id, {limit: 50})).body.items;
      case 'playlist':
        let tracks = [];
        let ret = (await this.api.getPlaylistTracks(id, {fields: 'items(track(name,artists(name),album(name)))'})).body.items;
        while (true) {
          if (!ret.length)
            return tracks.map(pt => pt.track);
          tracks.push(...ret);
          ret = (await this.api.getPlaylistTracks(id, {fields: 'items(track(name,artists(name),album(name)))', offset: tracks.length })).body.items;
        }
      default:
        return [];
    }
  }

  async getInfo(url) {
    await this.login()
    const { type, id } = this.parse(url);
    const results = await this.getAPIResult(type, id);
    return results.map(track => new SpotifyInfo(track));
  }

  getInfos(...urls) {
    return urls.map(this.getInfo);
  }
}

/**
 * @property {string} name
 * @property {string} artist
 * @property {string} album
 */
class SpotifyInfo {
  /**
   * @param {SpotifyApi.TrackObjectFull} track
   */
  constructor(track) {
    this.name = track.name;
    this.artist = track.artists ? track.artists[0].name : '';
    this.album = track.album?.name ?? '';
  }
}


function testGetSongs() {
  var testUrls = [
    'https://open.spotify.com/track/2OY8UbvrVHPxTENsdHWnpr?si=ID5AJvsXQAeBLtzDQOTJFQ',
    'spotify:track:2OY8UbvrVHPxTENsdHWnpr',
    'https://open.spotify.com/album/6RLAmJ22IPTWR4JF9DsZtR?si=g98eOxvdQyamymsGMjVvzA',
    'spotify:album:6RLAmJ22IPTWR4JF9DsZtR',
    'https://open.spotify.com/playlist/0cyH0TxFDgCQ2gQbs6shh2?si=nQ2SulZvQ5qaUTJL7K_SRQ',
    'spotify:playlist:0cyH0TxFDgCQ2gQbs6shh2'
  ];
  var api = new SpotifyBackend();
  testUrls.map(t => api.getInfo(t).then(console.log));
}

module.exports = { SpotifyBackend, SpotifyInfo }
