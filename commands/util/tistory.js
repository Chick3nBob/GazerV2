const { Command }   = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const snekfetch     = require('snekfetch');
const cheerio       = require('cheerio');
const archiver      = require('archiver');
const Transfer      = require('transfer-sh');
const fs            = require('fs-extra');
const path          = require('path');
const dl            = require('../../structures/dl-tools');

currentJobs = [];
let statusMsg;

module.exports = class TistoryCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'tistory',
            group: 'util',
            memberName: 'tistory',
            description: 'Scrapes images from a tistory page.',
            throttling: {
                usages: 1,
                duration: 60
            },
            args: [
                {
                    key: 'action',
                    prompt: 'What action do you want me to do? `download` `imgur` `links`',
                    type: 'string',
                    validate: action => {
                        if (['download', 'imgur', 'links'].includes(action)) return true;
                        return 'Please enter `download` `imgur` or `links`'
                    }
                },
                {
                    key: 'url',
                    prompt: 'What url do you want me to scrape?',
                    type: 'string'
                }
            ]
        });
    }

    async run(msg, args) {
        const { action, url } = args;

        // download HTML page
        const { text } = await snekfetch.get(url);
        const $ = cheerio.load(text);

        // check if it's a tistory site
        if (!$('head').html().includes('daumcdn.net/tistory_admin')) 
            return msg.say(`<${url}> is not a tistory site.   If you want another site supported please ask tzuwy#7080.`);

        // get images
        let images = [];
        $('.imageblock').each(function(i, elem) {
            images[i] = $(this).children().first().attr('src').replace('/image/', '/original/');
        });

        // check if there are any images
        if (!images.length) return msg.say(`Error: No images were found.`);

        // get page data
        let property, value, siteName, title;
        $('head meta').each(function(i, elem) {
            property = $(this).attr('property');
            value = $(this).attr('content');
            if (property == 'og:site_name') siteName = value;
            if (property == 'og:title') title = value;
        });

        let sum = images.reduce(function(acc, val) {
            return acc + val.length;
        })

        if (currentJobs.includes(msg.author.id)) return msg.say(`You're already running a download, please wait until it is finished.`);
        // prevent user from running multiple at once
        currentJobs.push(msg.author.id);

        // print out links
        if (action == 'links') {
            let index = currentJobs.indexOf(msg.author.id);
            currentJobs.splice(index, 1);

            if (sum < 1024) {
                let embed = new RichEmbed()
                    .setAuthor(siteName, 'http://i.imgur.com/poTkGDT.png', url)
                    .setColor(0xeb531f)
                    .addField(`Found ${images.length} images`, images.join('\n'));
                return msg.say({ embed });
            } else {
                // write links to buffer
                let buffer = new Buffer(images.join('\n'), "utf-8")
                // create embed
                let embed = new RichEmbed()
                    .setAuthor(siteName, 'http://i.imgur.com/poTkGDT.png', url)
                    .setColor(0xeb531f)
                    .addField(`Found ${images.length} images`, 'Exceeded embed limit, links in text file')
                    .attachFile({attachment: buffer, name: 'images.txt'});
                return msg.say({ embed });
            }
        }

        if (action == 'download') {
            statusMsg = await msg.channel.send(`Found ${images.length} images, starting download...`);

            const options = {
                filepath: path.join(__dirname, '..', '..', 'tmp'),
                urls: images, 
                maxSimulDownloads: 8
            }

            let zipOptions = {
                zlibLevel: 3,
                outputPath: path.join(__dirname, '..', '..', 'tmp', msg.author.id + '.zip')
            }

            let filesList;

            dl.download(options)
                .then(finished => {
                    filesList = finished;
                    console.log(filesList);
                    zipOptions.files = filesList;
                    return dl.zip(zipOptions);
                })
                .then(size => {
                    console.log(size);
                    statusMsg.edit(`Uploading zip file, size: ${(size / 1048576).toFixed(2)} MB`);
                    return dl.upload(zipOptions.outputPath);
                })
                .then(link => {
                    console.log(link);
                    statusMsg.edit(`Finished upload, download here:\n${link}`);
                    let index = currentJobs.indexOf(msg.author.id);
                    currentJobs.splice(index, 1);

                    // delete files
                    filesList.push(zipOptions.outputPath);
                    return dl.delete(filesList);
                })
                .catch(err => console.log(err));
        }
    }
};
