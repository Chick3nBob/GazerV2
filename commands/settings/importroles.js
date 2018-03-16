const { Command } = require('discord.js-commando');

module.exports = class ImportRolesCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'import-roles',
            aliases: ['importroles'],
            group: 'settings',
            memberName: 'import-roles',
            description: 'Imports role structure in JSON.  Overwrites current roles.',
            guildOnly: true,
            args: [
                {
                    key: 'roles',
                    prompt: 'What roles do you want to import? (JSON format)',
                    type: 'string'
                }
            ]
        });
    }
    
    hasPermission(msg) {
        return msg.member.hasPermission('ADMINISTRATOR');
    }

    run(msg, args) {
        const { roles } = args;
        try {
            var parsed = JSON.parse(roles);
        } catch (e) {
            return msg.say(`There's an error in the JSON data.`)
        }

        msg.guild.settings.set('roles', parsed);
        return msg.say(`Roles configuration updated.`);
    }
};
