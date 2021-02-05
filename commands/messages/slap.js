const { embedMessage } = require("../../libs/general/embedMessage");

module.exports = {
  name: "slap",
  aliases: ["sl"],
  category: "messages",
  description: "Slap your enemies like never before! You can even combo multiple enemies unlike Strive! \n\n **COMMAND LIST:** \n \`!slap @username\` \`!slap @username @username\`",
  execute(message) {
    if (!message.mentions.users.size)
      return message.channel.send(embedMessage(`NANI?!`, `There's no one to slap... ಥ_ಥ`))
      .catch(console.error);

    let username_list = '';
    let i = 1;

    message.mentions.users.forEach((value) => {
        username_list += value.username;
        if(i === message.mentions.users.size - 1){
          username_list += ` and `;
        }else if(i < message.mentions.users.size - 1){
          username_list += `, `;
        }
        
        i++;
    });
    
    return message.channel.send(embedMessage(`SURAPUUH POOOWAAAA`,`Just slapped ${username_list} around a bit with a large trout! \n **Yay! (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧** :fish:`)).catch(console.error);
  }
};