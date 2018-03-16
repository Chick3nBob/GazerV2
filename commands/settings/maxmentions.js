const { Command } = require('discord.js-commando');

module.exports = class MaxMentionsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'max-mentions',
            aliases: ['maxmentions'],
            group: 'settings',
            memberName: 'max-mentions',
            description: 'Sets the amount of mentions in a message someone can send before auto-mute.',
            guildOnly: true,
            args: [
                {
                    key: 'max',
                    prompt: 'What do you want to set the maximum amount of mentions someone can send? Set to `0` to disable',
                    type: 'integer',
                    validate: max => {
                        if (max > -1) return true;
                        return 'Please enter a valid number.'
                    }
                }
            ]
        });
    }
    
    hasPermission(msg) {
        return msg.member.hasPermission('ADMINISTRATOR');
    }

    run(msg, args) {
        const { max } = args;

        msg.guild.settings.set('maxMentions', max);
        return msg.say(`Maximum message mentions set to ${max}.  Users will be automatically muted if exceeded.`);
    }
};