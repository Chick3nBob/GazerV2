const { Command } = require('discord.js-commando');

module.exports = class MuteRoleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'mute-role',
            aliases: ['muterole'],
            group: 'settings',
            memberName: 'mute-role',
            description: 'Sets the mute role to be re-assigned if someone leaves with it.',
            guildOnly: true,
            args: [
                {
                    key: 'role',
                    prompt: 'What role should be mute?',
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
        msg.guild.settings.set('muteRole', role.id);
        return msg.say(`Mute role set to ${role.name}.`);
    }
};
