const { Command } = require('discord.js-commando');

module.exports = class BlockInviteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'block-invite',
            aliases: ['blockinvite', 'blockinvites', 'inviteguard'],
            group: 'settings',
            memberName: 'block-invite',
            description: 'Configures auto-delete for invites.',
            guildOnly: true,
            args: [
                {
                    key: 'action',
                    prompt: 'Do you want to enable or disable invite blocking? `enable`, `disable`',
                    type: 'string',
                    validate: action => {
                        if (['enable', 'on', 'disable', 'off'].includes(action)) return true;
                        return 'Please enter `enable` or `disable``'
                    }
                }
            ]
        });
    }
    
    hasPermission(msg) {
        return msg.member.hasPermission('ADMINISTRATOR');
    }

    run(msg, args) {
        const { action } = args;

        if (['enable', 'on'].includes(action)) {
            msg.guild.settings.set('inviteGuard', true);
            return msg.say('Invite blocking is now enabled.');
        }
        
        if (['disable', 'off'].includes(action)) {
            msg.guild.settings.set('inviteGuard', false);
            return msg.say('Invite blocking is now disabled.')
        }
    }
};