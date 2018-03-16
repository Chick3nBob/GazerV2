const { Command } = require('discord.js-commando');

module.exports = class AddRoleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'add-role',
            aliases: ['addrole'],
            group: 'settings',
            memberName: 'add-role',
            description: 'Adds a role for users to assign.',
            guildOnly: true,
            args: [
                {
                    key: 'name',
                    prompt: 'What is the name of the role you want displayed?',
                    type: 'string'
                },
                {
                    key: 'search',
                    prompt: 'What do you want the RegEx search pattern to be?',
                    type: 'string'
                },
                {
                    key: 'primary_role',
                    prompt: 'What is the primary role you want assignable?',
                    type: 'role'
                },
                {
                    key: 'secondary_role',
                    prompt: 'What is the secondary role you want assignable?',
                    type: 'role'
                }
            ]
        });
    }
    
    hasPermission(msg) {
        return msg.member.hasPermission('ADMINISTRATOR');
    }

    run(msg, args) {
        const { name, search, primary_role, secondary_role } = args;
        let roles_string = msg.guild.settings.get('roles', false);
        
        if (roles_string) {
            try {
                roles_object = JSON.parse(roles_string)
            } catch (e) {
                return msg.say(`There's an error in the roles configuration, please fix before adding a role.`);
            }
        }

        roles_object[name]["search"] = search;
        roles_object[name]["primary"] = primary_role.id;
        roles_object[name]["secondary"] = secondary_role.id;

        msg.guild.settings.set('roles', JSON.stringify(roles_object));
        return msg.say(`Role ${name} added with search ${search}.`);
    }
};
