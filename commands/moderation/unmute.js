const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports = class UnMuteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'unmute',
            group: 'moderation',
            memberName: 'unmute',
            description: 'unmutes a user and logs the unmute to the mod logs.',
            guildOnly: true,
            args: [
                {
                    key: 'member',
                    prompt: 'What member do you want to unmute?',
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

        if (!member.roles.has(mute_role)) return msg.say(`Member isn't muted`);

        try {
            await member.removeRole(mute_role);
            msg.say(':monkey_face:');
            const embed = new RichEmbed()
                .setAuthor(msg.author.tag, msg.author.displayAvatarURL)
                .setColor(0x00AE86)
                .setTimestamp()
                .setDescription(stripIndents`
                    **Member:** ${member.user.tag} (${member.id})
                    **Action:** Unmute
                    **Reason:** ${reason}
                `);
            return modlogs.send({ embed });
        } catch (err) {
            return msg.say(`${err.name}: ${err.message}`);
        }
    }
};
