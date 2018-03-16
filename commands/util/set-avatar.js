const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class SetAvatarCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'set-avatar',
            aliases: ['setavatar'],
            group: 'util',
            memberName: 'set-avatar',
            description: 'Sets the bot\'s avatar.',
            args: [
                {
                    key: 'url',
                    prompt: 'What do you want to set my avatar to?',
                    type: 'string'
                }
            ]
        });
    }
    
    hasPermission(msg) {
        return this.client.isOwner(msg.author);
    }

    run(msg, args) {
        const { url } = args;
        this.client.user.setAvatar(url)
            .then(user => {
                return msg.say(`New avatar set!`);
            })
            .catch(err => {
                return msg.say(`${err.name}: ${err.message}`);
            });
    }
};
