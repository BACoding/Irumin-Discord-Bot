const { Message, Guild } = require('discord.js')
const ANSWERS = {
  ROCK: ['rock', 'pedra', 'guu', 'ぐう'],
  PAPER: ['paper', 'papel', 'paa', 'ぱあ'],
  SCISSORS: ['scissors', 'tesoura', 'choki', 'ちょき'],
}
const BEATS = {ROCK: ['SCISSORS'], PAPER: ['ROCK'], SCISSORS: ['PAPER']};
const GAME_TIMEOUT = 30000;

function checkWin (game) {
  if (!game.started) return;
  if (Object.values(game.answers).flat().length < Object.keys(game.players).length) return;
  let winner, loser;
  Object.entries(game.answers).forEach(([answer, players]) => {
    if (!players.length) return;
    if (!loser && !winner) loser = [answer, players];
    else if (!winner) {
      if (loser[0] in BEATS[answer])
        winner = [answer, players];
      else {
        winner = loser;
        loser = [answer, players];
      }
    }
  });
  return {winner, loser};
}
function endGame (game, result) {
  if (!result.winner) {
    game.channel.send('draw')
  } else {
    game.channel.send(`winner(s): ${result.winner[1].map(id => `<!${id}>`).join(' ')}`)
  }
  game.started = null;
  if (!game.highscores[winner]) game.highscores[winner] = 0;
  game.highscores[winner]++;
}

module.exports = {
  name: "janken",
  aliases: ["rps", "jankenpon", "ジャンケン"],
  category: "games",
  description: "Initiates game of rock-paper-scissors, aka jan-ken-pon, aka scissors-paper-rock if you're a psychopath.",
  minPlayers: 1,
  maxPlayers: 2,
  timeout: GAME_TIMEOUT,
  /**
   * @param {Message} message
   */
  execute(message) {
    const client = message.client;
    const guild = message.guild;

    if (!guild[this.name]) guild[this.name] = {
      started: null,
      channel: null,
      players: null,
      answers: null,
      highscores: {},
    };
    const game = guild[this.name];

    if (!game.started) {
      game.started = new Date();
      game.channel = message.channel;
      game.players = message.mentions.users.clone().first(2);
      if (game.players.size < 1) game.players.
      game.answers = {};
      message.channel.send(`game started. check your DMs: ${game.players.map(u => u.username).join(', ')}`)
      message.mentions.users.forEach(u =>
        u.send(`reply with your pick [\`${Object.keys(ANSWERS).join('` `')}\`]`).then(m => {

        }));

      if (game.players.length < 2) {
        players.push(client.user);
        let botGuess = Object.keys(ANSWERS)[Math.floor(Math.random() * ANSWERS.length)];
        answers[botGuess].push(client.user.id);
      }

      // global.setTimeout(() => checkWin(game), this.timeout)
    } else if (game.started && !message.guild) {
      if (!message.guild) {
        let answer = Object.key(ANSWERS).find(a => ANSWERS[a].indexOf(message.content.trim()) > -1);
        if (answer) game.answers[answer].push(message.author.id);
      }

      let winner;
      if ((winner = checkWin(game)))
        endGame(game, winner)
    }


  }
};
