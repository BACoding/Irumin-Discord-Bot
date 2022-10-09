const { MessageEmbed } = require(`discord.js`);
const config = require(`../../config/auth.json`);

module.exports = {
  embedMessage (title, description, fields, image, footerText, footerImage) {
    let embedMsg = new MessageEmbed().setColor(config.EMBED_COLOR);

    if (title) embedMsg.setTitle(title);

    if (description) {
      let msgString = Array.isArray(description)
        ? description.join(` \n`)
        : description;
      embedMsg.setDescription(msgString);
    }

    if (fields) {
      if (!Array.isArray(fields)) fields = [fields];

      fields.forEach(function (field) {
        if (!field.value) return;
        embedMsg.addField(
          field.name.toUpperCase(),
          field.value.join(` `),
          field.inline
        );
      });
    }

    if (image) {
      if (image.match(/\.(jpeg|jpg|gif|png)$/) != null)
        embedMsg.setImage(image);
    }

    if (footerText) embedMsg.setFooter(footerText, footerImage);

    return embedMsg;
  },
};
