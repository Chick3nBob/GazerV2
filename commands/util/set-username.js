const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class SetUsernameCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'set-username',
            aliases: ['setusername'],
            group: 'util',
            memberName: 'set-username',
            description: 'Sets the bot\'s username.',
            args: [
                {
                    key: 'name',
                    prompt: 'What do you want to change my name to?',
                    type: 'string'
                }
            ]
        });
    }
    
    hasPermission(msg) {
        return this.client.isOwner(msg.author);
    }

    run(msg, args) {
        const { name } = args;
        this.client.user.setUsername(name)
            .then(user => {
                return msg.say(`New username set to ${name}`);
            })
            .catch(err => {
                return msg.say(`${err.name}: ${err.message}`);
            });
    }
};
