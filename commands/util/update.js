const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class UpdateCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'update',
            group: 'util',
            memberName: 'update',
            description: 'Sends an update to the updates channel.',
            guildOnly: true,
            args: [
                {
                    key: 'title',
                    prompt: 'What is the title of the update?',
                    type: 'string'
                },
                {
                    key: 'update',
                    prompt: 'What is the update?',
                    type: 'string'
                }
            ]
        });
    }
    
    hasPermission(msg) {
        return msg.member.hasPermission('ADMINISTRATOR');
    }

    run(msg, args) {
        const { title, update } = args;
        const channel = msg.guild.channels.get(msg.guild.settings.get('updatesChannel'));

        if (!channel) return msg.say(`There isn't an updates channel set.`);

        const embed = new RichEmbed()
            .setAuthor(msg.author.tag, msg.author.displayAvatarURL)
            .setColor(0x00AE86)
            .setTimestamp()
            .setFooter(msg.author.id)
            .setTitle(title)
            .setDescription(update);

        channel.send({embed: embed});
        return msg.say(`:thumbsup:`);
    }
};
