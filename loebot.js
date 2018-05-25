const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
const db = require('quick.db');
const prefix = "$"


// Ready - Listeners
client.on('ready', () => {
  // The client will play this until you change it.
  client.user.setActivity('PainFX#0001', { //This should not be changed until the development is done.
    type: "LISTENING"
  })

  // We can post into the console that the client launched.
  console.log(`Logged in as ${client.user.tag}`);
});

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

fs.readdir('./commands/', (err, files) => {
	if (err)
		console.error(err);
	let jsfiles = files.filter(f => f.split('.')
		.pop() === 'js');
	if (jsfiles.length <= 0) {
		console.log('No commands to load!');
		return;
	}
	console.log(`[Commands] Loaded a total amount ${files.length} Commands`);
	jsfiles.forEach(f => {
		let props = require(`./commands/${ f }`);
		props.fileName = f;
		client.commands.set(props.help.name, props);
	});
});


client.on('message', message => {
// In message event
	let msg = message.content.toLowerCase() || message.content.toUpperCase();
	if (!msg.startsWith(prefix)) return
	if (message.author.bot) return;
	let args = message.content.slice(prefix.length).trim().split(' ');
	let command = args.shift().toLowerCase();

	let cmd;
	if (client.commands.has(command)) {
		cmd = client.commands.get(command);
	} else if (client.aliases.has(command)) {
		cmd = client.commands.get(client.aliases.get(command));
	}
		cmd.run(client, message, args);
	});
          

// Create new folder named "commands" and add files for each command, example for command google, create a file named "google.js", must be in the folder "commands". 
// each command file must have module.exports.run = (client, message, args) => { // code here }; and exports.conf = { aliases: [] }; exports.help = { name: 'tag', description: '', usage: 'tag <name>'};
// Example:
// module.exports.run = (client, message, args) => {
// message.channel.send('example');
// };
// exports.conf = {
// aliases: ['example', 'chexample']
// };

// exports.help = {
// name: 'example', description: 'hello this is description', usage: 'example'
// };

client.login("NDQ4OTI5NTQzMzQ5MzM4MTEz.DedSQQ.GcsUm53bKZH1X-zrBhyYahhcXl8");
