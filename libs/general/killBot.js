/**
 * @param {Client} client
 */
function killBot (client) {
  if (client && `destroy` in client) client.destroy();
  console.debug(`Bye!`);
  process.exit(0);
}

module.exports = killBot;
