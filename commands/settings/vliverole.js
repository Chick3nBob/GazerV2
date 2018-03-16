const { Command } = require('discord.js-commando');

module.exports = class MuteRoleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'vlive-role',
            group: 'settings',
            memberName: 'vlive-role',
            description: 'Sets the VLive role.',
            guildOnly: true,
            args: [
                {
                    key: 'role',
                    prompt: 'What role should be for VLive?',
                    type: 'role'
                }
            ]
        });
    }
    
    hasPermission(msg) {
        return msg.member.hasPermission('ADMINISTRATOR');
    }

    run(msg, args) {
        const { role } = args;
        msg.guild.settings.set('vliveRole', role.id);
        return msg.say(`VLive role set to ${role.name}.`);
    }
};
