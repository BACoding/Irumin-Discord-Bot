module.exports = {
  convertMs(time) {
    var convertedMs = (time / 1000).toFixed(0);

    let hours = Math.floor(convertedMs / 60 / 60);
    let minutes = Math.floor(convertedMs / 60) - (hours * 60);
    let seconds = convertedMs % 60;
    
    let formattedTime = ``;

    if (hours != "00")
      formattedTime += `${hours.toString().padStart(2, '0')}:`;

    formattedTime += `${minutes.toString().padStart(2, '0')}:`;
    formattedTime += `${seconds.toString().padStart(2, '0')}`;
    
    return formattedTime;
  },
  convertSeconds(time) {
    let hours = Math.floor(time / 60 / 60);
    let minutes = Math.floor(time / 60) - (hours * 60);
    let seconds = time % 60;
    
    let formattedTime = ``;

    if (hours != "00")
      formattedTime += `${hours.toString().padStart(2, '0')}:`;

    formattedTime += `${minutes.toString().padStart(2, '0')}:`;
    formattedTime += `${seconds.toString().padStart(2, '0')}`;
    
    return formattedTime;
  }
};



