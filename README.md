# Coding A Discord Bot
Discord.JS

Getting Started
If you do not know anything about coding in JavaScript then I suggest you go to one these websites to learn.
- https://www.sololearn.com/Course/JavaScript/
 - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide
 - https://www.khanacademy.org/computing/computer-programming



**Starting on the coding**


-1.) Make a folder with a file named `bot.js`

-2.) Open that file in CMD

-3.) Do `npm install discord.js --save`

-4.) Copy starting off copy at bottom and paste in VS or Atom

-5.) Go to https://discordapp.com/developers/applications/me to create your bot

-6.) Click on Client's ID and copy that.

-7.) Go to https://discordapi.com/permissions.html and ID where it says `Client ID:`

-8.) Copy your client's token and replace that with `your_token` in the code.

-9.) Once all done, go back to CMD and do `node bot.js` and your bot should run. 



**Basic Starting Code**

```js
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
   console.log('I am ready!');
});

client.on('message', message => {
   if (message.content === 'ping') {
       message.reply('pong');
 }
});

client.login('your token');
```
