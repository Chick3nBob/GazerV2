const { Command } = require('discord.js-commando');

module.exports = class RoleChannelCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'role-channel',
            aliases: ['rolechannel', 'rolechan'],
            group: 'settings',
            memberName: 'role-channel',
            description: 'Sets the channel for roles.',
            guildOnly: true,
            args: [
                {
                    key: 'channel',
                    prompt: 'What is the channel you want set for roles?',
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
        msg.guild.settings.set('rolesChannel', channel.id);
        return msg.say(`Roles channel set to ${channel.name}.`);
    }
};
