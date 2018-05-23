    module.exports.help = {
        name: "help",
        desc: "Shows this message",
      aliases: "help me"
    }

const Discord = require("discord.js");

exports.run = async (client, message, args, tools, con) => {
    try {
        await message.author.send(`\`\`\`md\n#Teddy Premium Commands:\n\`\`\` \n${client.commands.map(cmd => `\`${cmd.help.name}\` - ${cmd.help.desc}`).join("\n")}`);
        message.channel.send("Help sent.");
    } catch (e) {
        throw e;
    }
}