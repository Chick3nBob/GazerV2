const { Command } = require('discord.js-commando');

module.exports = class RoleLimitCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'role-limit',
            aliases: ['rolelimit', 'limitrole'],
            group: 'settings',
            memberName: 'role-limit',
            description: 'Sets the limit to roles.',
            guildOnly: true,
            args: [
                {
                    key: 'limit',
                    prompt: 'What do you want the roles limit set to?',
                    type: 'integer'
                }
            ]
        });
    }
    
    hasPermission(msg) {
        return msg.member.hasPermission('ADMINISTRATOR');
    }

    run(msg, args) {
        const { limit } = args;
        msg.guild.settings.set('roleLimit', limit);
        return msg.say(`Roles limit set to ${limit}.`);
    }
};
