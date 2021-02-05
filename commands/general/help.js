const { embedMessage } = require("../../libs/general/embedMessage");
const { PREFIX, IRUMIN_CHA } = require("../../config/config.json");

module.exports = {
  name: "help",
  aliases: ["h"],
  category: "general",
  description: "",
  execute(message, args) {
    let commands = message.client.commands.array();
    let helpList = [];

    if(args.length === 0){
      helpTitle = ""
      commands.forEach(function(item) {
        if (item.name !== "help") {
          let helpCmd = helpList.find(i => i.name === item.category);
          
          if(!helpCmd){
            let newHelpCmd = {
              'name': item.category,
              'value': ["\`" + PREFIX + item.name + "\`"],
              'inline': false
            };
            
            helpList.push(newHelpCmd);
          }else{
            helpCmd.value.push("\`" + PREFIX + item.name + "\`");
          }
        }
      });

      return message.channel.send(embedMessage(`IRUMIN | HOW TO USE`, `Try typing \`!help [with command]\` for more info.`, helpList, ``, `IRUMIN v0.8`, message.client.user.avatarURL()));
    }else{
      let command = commands.find(e => e.name === args[0] || e.aliases[0] === args[0]);    

      if(!command)
        return message.channel.send(embedMessage(`IRUMIN | HOW TO USE`, `Eh? I can't find that anywhere... Are you sure that exists or do you need \`!help\`?`));
      
      console.log(command.aliases);
      return message.channel.send(embedMessage(`IRUMIN | HOW TO USE [ ${PREFIX + command.name.toUpperCase()} ]`, command.description, '', command.image, ``, command.aliases.length >= 1 ? `• You can also use [ ${PREFIX + command.aliases} ]` : ''));
    }
  }
};