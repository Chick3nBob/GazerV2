const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports = class MuteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'mute',
            aliases: ['silence', 'stfu'],
            group: 'moderation',
            memberName: 'mute',
            description: 'Mutes a user and logs the mute to the mod logs.',
            guildOnly: true,
            args: [
                {
                    key: 'member',
                    prompt: 'What member do you want to mute?',
                    type: 'member'
                },
                {
                    key: 'reason',
                    prompt: 'What do you want to set the reason as?',
                    type: 'string',
                    default: 'No reason given.',
                    validate: reason => {
                        if (reason.length < 140) return true;
                        return 'Invalid Reason. Reason must be under 140 characters.';
                    }
                }
            ]
        });
    }
    
    hasPermission(msg) {
        return msg.member.hasPermission('BAN_MEMBERS') || msg.member.roles.has(msg.guild.settings.get('staffRole'));
    }

    async run(msg, args) {
        if (!msg.channel.permissionsFor(this.client.user).has('MANAGE_ROLES'))
            return msg.say('This Command requires the `Manage Roles` Permission.');
        const modlogs = msg.guild.channels.get(msg.guild.settings.get('modLog'));
        const mute_role = msg.guild.settings.get('muteRole');
        if (!mute_role) return msg.say('There is no mute role set.');
        if (!modlogs) return msg.say('This Command requires a channel set with the `modchannel` command.');
        if (!modlogs.permissionsFor(this.client.user).has('SEND_MESSAGES'))
            return msg.say('This Command requires the `Send Messages` Permission for the Mod Log Channel.');
        if (!modlogs.permissionsFor(this.client.user).has('EMBED_LINKS'))
            return msg.say('This Command requires the `Embed Links` Permission.');
        const { member, reason } = args;

        try {
            await member.addRole(mute_role);
            msg.say(':speak_no_evil:');
            const embed = new RichEmbed()
                .setAuthor(msg.author.tag, msg.author.displayAvatarURL)
                .setColor(0xFF0000)
                .setTimestamp()
                .setDescription(stripIndents`
                    **Member:** ${member.user.tag} (${member.id})
                    **Action:** Mute
                    **Reason:** ${reason}
                `);
            return modlogs.send({ embed });
        } catch (err) {
            return msg.say(`${err.name}: ${err.message}`);
        }
    }
};
