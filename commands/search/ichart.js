const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = class iChartCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ichart',
            group: 'search',
            memberName: 'ichart',
            description: 'Gets the current ichart.'
        });
    }

    async run(msg, args) {
        if (msg.channel.type !== 'dm')
            if (!msg.channel.permissionsFor(this.client.user).has('EMBED_LINKS'))
                return msg.say('This Command requires the `Embed Links` Permission.');
        const { query } = args;
        try {
            const { text } = await snekfetch
                .get('http://www.instiz.net/ichart_graph_list.htm');

            var data = text.replace(/<(.|\n)*?>/g, "");

            var embed = new RichEmbed()
                .setTitle("iChart™ Real Time Chart")
                .setColor(0x1FC679)
                .setTimestamp();

            var data = data.split("@@##@@");
            for (let i = 0; i < data.length - 1; i++) {
                let sdata = data[i].split("##!##");
                let title = sdata[1] + ' - ' + sdata[2];
                let rank = sdata[3];

                embed.addField(title, rank, false);
            }

            return msg.embed(embed);
        } catch (err) {
            return msg.say(`${err.name}: ${err.message}`);
        }
    }
};
