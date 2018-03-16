const { Command } = require('discord.js-commando');

module.exports = class GalleryChannelCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'gallery-channel',
            aliases: ['gallerychannel', 'gallerychan'],
            group: 'settings',
            memberName: 'gallery-channel',
            description: 'Sets the gallery channels.',
            guildOnly: true,
            args: [
                {
                    key: 'channel',
                    prompt: 'What is the channel you want to send gallery images / links to?',
                    type: 'channel'
                },
                {
                    key: 'type',
                    prompt: 'Do you want to watch or send to this channel? `watch`, `send`',
                    type: 'string'
                }
            ]
        });
    }
    
    hasPermission(msg) {
        return msg.member.hasPermission('ADMINISTRATOR');
    }

    run(msg, args) {
        const { channel, type } = args;

        if (type == 'watch') {
            msg.guild.settings.set('galleryWatchChannel', channel.id);
            return msg.say(`Gallery watch channel set to ${channel.name}.`);
        }

        if (type == 'send') {
            msg.guild.settings.set('gallerySendChannel', channel.id);
            return msg.say(`Gallery send channel set to ${channel.name}.`);
        }
    }
};
