const convertMs = (time) => new Date(time).toJSON().slice(11,-5);
const convertSeconds = (time) => convertMs(time*1000);

module.exports = { convertMs, convertSeconds };
