const { Command } = require('discord.js-commando');

module.exports = class MsgLogCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'message-log-channel',
            aliases: ['msglogchannel', 'msglogchan', 'msgchannel'],
            group: 'settings',
            memberName: 'member-log-channel',
            description: 'Sets the channel for the message logs to be sent.',
            guildOnly: true,
            args: [
                {
                    key: 'channel',
                    prompt: 'What is the channel you want to send message logs to?',
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
        msg.guild.settings.set('msgLog', channel.id);
        return msg.say(`Message Log channel set to ${channel.name}.`);
    }
};
