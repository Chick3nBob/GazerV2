const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = class ChartCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'chart',
            group: 'search',
            memberName: 'chart',
            description: 'Gets a song\'s current chart.',
            args:[
                {
                    key: 'artist',
                    prompt: 'What artist / group do you want to search? (Certain names are in hangul only)',
                    type: 'string'
                },
                {
                    key: 'song',
                    prompt: 'What song do you want to search? (Certain songs are in hangul only)',
                    type: 'string'
                }
            ]
        });
    }

    async run(msg, args) {
        if (msg.channel.type !== 'dm')
            if (!msg.channel.permissionsFor(this.client.user).has('EMBED_LINKS'))
                return msg.say('This Command requires the `Embed Links` Permission.');
        const { artist, song } = args;
        var url = `http://www.instiz.net/iframe_ichart_score_quick.htm?at=${artist}&sn=${song}`;
        try {
            const { text } = await snekfetch
                .get(url);

            var data = text.replace(/<(.|\n)*?>/g, ""); // remove html tags for raw data

            var first_3 = data.substring(0, 3);
            var numbers = first_3.match(/\d+/g);

            if (numbers == undefined) return msg.say(`${msg.author} Artist / Song not found, maybe one is in hangul.`);
            
            var values = data.split("*");
            var scores = [];

            // parse scores
            for (var i = 0; i < 18; i++) { // only 18 max values on the chart, don't want extra shit at back
                var numbers = values[i].match(/\d+/g);

                if (numbers == undefined) scores.push("N/A");
                else {
                    var value = parseInt(numbers[0]);
                    scores.push(value);
                }
            }

            let time = values[values.length - 1].split("@");
            time = time[time.length - 1];

            var first_count = 0;
            for (var i = 0; i < scores.length; i++) {
                if (scores[i] == 1) first_count++;
            }

            var embed = new RichEmbed()
                .setTitle(`${artist} - ${song}`)
                .setURL("http://www.instiz.net/bbs/list.php?id=spage&no=8")
                .addField("iChart™", 
                    `Weekly (Total Score): ${scores[0]}\nRealtime (Total Score): ${scores[1]}`)
                .addField("Melon", 
                    `Daily TOP 100 (Total): ${scores[2]}\nRealtime: ${scores[3]}`)
                .addField("Mnet", 
                    `Total Daily: ${scores[4]}\nTotal Realtime: ${scores[5]}`)
                .addField("Bugs", 
                    `Song Chart Daily: ${scores[6]}\nSong Chart Realtime: ${scores[7]}`)
                .addField("olleh", 
                    `TOP 100 (Daily): ${scores[8]}\nTOP 100 (Realtime): ${scores[9]}`)
                .addField("Soribada", 
                    `Total (Daily): ${scores[10]}\nTotal (Realtime): ${scores[11]}`)
                .addField("Genie", 
                    `TOP 100 (Daily): ${scores[12]}\nTOP 100 (Realtime): ${scores[13]}`)
                .addField("Naver", 
                    `TOP100 Total (Daily): ${scores[14]}\nTOP100 Total (Realtime): ${scores[15]}`)
                .addField("Monkey3", 
                    `Total (Daily): ${scores[16]}\nTotal (Realtime): ${scores[17]}`)
                .setFooter(time)

            if (first_count == 18) { // all kill
                embed.setColor(0x2ecc71); // set color to green
            }

            return msg.embed(embed);
        } catch (err) {
            return msg.say(`${err.name}: ${err.message}`);
        }
    }
};
