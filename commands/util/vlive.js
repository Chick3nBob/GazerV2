const { Command } = require('discord.js-commando');

module.exports = class AddRoleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'vlive',
            group: 'util',
            memberName: 'vlive',
            description: 'Gives you the vlive role to be notified.',
            guildOnly: true,
            args: [
                {
                    key: 'action',
                    prompt: 'Do you want to be enable or disable vlive mentions?  `enable` `disable`',
                    type: 'string',
                    validate: action => {
                        if (['enable', 'disable'].includes(action)) return true;
                        return 'Please enter either `enable` or `disable`';
                    }
                }
            ]
        });
    }

    async run(msg, args) {
        const { action } = args;
        let role = msg.guild.settings.get('vliveRole', false);
        
        if (!role) return msg.say(`There is no vlive role set.`);

        if (action == 'enable') {
            if (msg.member.roles.has(role))
                return msg.say(`You already have vlive notifications enabled.`);

            await msg.member.addRole(role);
            return msg.say(`Enabled vlive notifications.`);
        }

        if (action == 'disable') {
            if (!msg.member.roles.has(role)) return msg.say(`You don't have vlive notifications enabled.`);

            await msg.member.removeRole(role);
            return msg.say(`Disabled vlive notifications.`);
        }
    }
};
