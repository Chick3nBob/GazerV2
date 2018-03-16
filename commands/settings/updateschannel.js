const { Command } = require('discord.js-commando');

module.exports = class UpdatesChannelCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'updates-channel',
            aliases: ['updateschannel', 'updatechan'],
            group: 'settings',
            memberName: 'updates-channel',
            description: 'Sets the channel for updates.',
            guildOnly: true,
            args: [
                {
                    key: 'channel',
                    prompt: 'What is the channel you want set for updates?',
                    type: 'channel'
                }
            ]
        });
    }
    
    hasPermission(msg) {
        return msg.member.hasPermission('ADMINISTRATOR');
    }

    run(msg, args) {
        const { channel } = args;
        msg.guild.settings.set('updatesChannel', channel.id);
        return msg.say(`Updates channel set to ${channel.name}.`);
    }
};
