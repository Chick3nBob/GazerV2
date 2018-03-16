const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports = class BulkBanCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'bulk-ban',
            aliases: ['bulkban', 'batchban', 'massacre'],
            group: 'moderation',
            memberName: 'bulk-ban',
            description: 'Bans a list of user IDs and logs the bans to the mod logs.',
            guildOnly: true,
            args: [
                {
                    key: 'users',
                    prompt: 'Which users do you want to ban? (Give a list of IDs separated by spaces or commas)',
                    type: 'string'
                }
            ]
        });
    }

    hasPermission(msg) {
        return msg.member.hasPermission('BAN_MEMBERS') || msg.member.roles.has(msg.guild.settings.get('staffRole'));
    }

    async run(msg, args) {
        if (!msg.channel.permissionsFor(this.client.user).has('BAN_MEMBERS'))
            return msg.say('This Command requires the `Ban Members` Permission.');
        const modlogs = msg.guild.channels.get(msg.guild.settings.get('modLog'));
        if (!modlogs) return msg.say('This Command requires a channel set with the `modchannel` command.');
        if (!modlogs.permissionsFor(this.client.user).has('SEND_MESSAGES'))
            return msg.say('This Command requires the `Send Messages` Permission for the Mod Log Channel.');
        if (!modlogs.permissionsFor(this.client.user).has('EMBED_LINKS'))
            return msg.say('This Command requires the `Embed Links` Permission.');
        const { users, reason } = args;

        let regex = /\b[0-9]{17,18}\b/g;
        let found = users.match(regex);

        if (!found.length) return msg.say('No IDs found.  Are the IDs separated by spaces or commas?');

        let bot_client = this.client;
        let sent = await msg.channel.send(`Attempting to ban ${found.length} users.`);

        async function ban_user(index) {
            // fetch user
            var user = await bot_client.fetchUser(found[index])
                .catch(err => sent.edit(sent.content += `\n${err.name}: ${err.message} ${found[index]}.`))

            // check if a user was found, some reason when a user not found
            // var user is the id of the sent message, so use user.tag to check
            if (user.tag) {
                msg.guild.ban(found[index], { days: 7, reason })
                    .then(sent.edit(sent.content += `\nBanned user ${user.tag} (${user.id}).`))

                // create embed
                let embed = new RichEmbed()
                    .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
                    .setColor(0xFF0000)
                    .setTimestamp()
                    .setDescription(stripIndents`
                        **User:** ${user.tag} (${user.id})
                        **Action:** Ban
                        **Reason:** Bulk ban.
                    `);
                // send embed
                modlogs.send({ embed });
            }
            // continue
            if (index < found.length - 1) ban_user(index + 1);
            else sent.edit(sent.content += `\nFinished bulk ban.`)
        }
        // start killing people
        ban_user(0);

    }
};
