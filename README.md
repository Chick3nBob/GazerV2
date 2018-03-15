# GazerV2

[Discord Server](https://discord.gg/5dGwF2T)

Packages
---------
- discord.js ( Main Libray )
- sqlite ( Main Database )
- moment ( Timer )
- weather.js ( Searching Weather )
AND MORE


How to install and use for yourself?
-------------

1.) Download this project or git clone.
2.) In you console (cmd) locate your this folder and open it. (Within CMD)
3.) Run the following command in cmd `npm install`. That should install all the packages that you will need for the bot.
4.) Now head over to the main file of the bot `commando.js` and replace the following
```js
const path = require('path');
const Commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const sql = require('sqlite');
const client = new Commando.Client({
	owner: ['YOUR_ID'],
	unknownCommandResponse: false,
	commandPrefix: '$'
});

client
	.on('error', console.error)
	.on('warn', console.warn)
	.on('debug', console.log)
	.on('ready', () => {
    client.user.setGame('@Gazer#3861 help')
		console.log(`Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
	})
	.on('disconnect', () => { console.warn('Disconnected!'); })
	.on('reconnecting', () => { console.warn('Reconnecting...'); })
	.on('commandError', (cmd, err) => {
		if(err instanceof Commando.FriendlyError) return;
		console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
})
	.on('commandBlocked', (msg, reason) => {
		console.log(oneLine`
			Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
			blocked; ${reason}
		`);
	})
	.on('commandPrefixChange', (guild, prefix) => {
		console.log(oneLine`
			Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	})
	.on('commandStatusChange', (guild, command, enabled) => {
		console.log(oneLine`
			Command ${command.groupID}:${command.memberName}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	})
	.on('groupStatusChange', (guild, group, enabled) => {
		console.log(oneLine`
			Group ${group.id}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	});

client.setProvider(
	sql.open(path.join(__dirname, 'database.sqlite3')).then(db => new Commando.SQLiteProvider(db))
).catch(console.error);

client.registry
.registerGroups([
	['moderation', 'Moderation'],
	['response', 'Random Response'],
  ['info', 'Info'],
	['search', 'Search'],
  ['avatar-edit', 'Avatar Manipulation'],
  ['role-manage', 'Role Manage'],
	['games', 'Games'],
	['settings', 'Server Settings']
])
	.registerDefaults()
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.login("YOUR_BOT_TOKEN");
```

5.) Go back to console and run the following command `node --harmony commando.js`
6.) Have fun :D

Credits
--------

All credits goes to `PainFX#4965` and `allte#4008` for making this all happen. 
