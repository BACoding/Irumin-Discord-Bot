const { Client } = require('discord.js');
const { exec } = require('child_process');
const { SYSTEMD_NAME } = require('../../config/config.json');

/**
 * @param {Client} client
 */
function restartBot() {
  exec(`/bin/systemctl --user restart ${SYSTEMD_NAME}`, function (error, stdout) {
    console.debug(stdout);
  });
}

module.exports = restartBot;
