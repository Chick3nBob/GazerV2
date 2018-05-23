exports.run = (client, message, Discord, prefix) => {
    var role = message.guild.roles.find(`name`, ``);
    const pain = "228349229230325760";
    const args = message.content.split(" ").slice(1);
  if (message.author.id !== pain) return;
  
    if (message.author.id === pain) {
      try {
        const code = args.join(" ");
        let evaled = eval(code);
  
        if (typeof evaled !== "string")
          evaled = require("util").inspect(evaled);
  
        var ans = (clean(evaled), {code:"xl"});
        var embed = new Discord.RichEmbed()
        .setDescription("Eval")
        .setColor(0xff5148)
        .addField("Input", "```"+code+"```")
        .addField("Output", "```"+evaled+"```")
        return message.channel.send(embed);
      } catch (err) {
        message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
      }
  }
  function clean(text) {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
      }
  }

module.exports.help = {
  name: "eval",
  desc: "Evalute Something"
}
