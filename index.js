// Invitation link: https://discord.com/oauth2/authorize?client_id=812291101934616587&scope=bot
const fs = require('fs');
const Discord = require('discord.js');
const cf = require('./components/commonFunctions.js');
const scheduling = require('./components/scheduling.js');

const client = new Discord.Client();
client.commands = new Discord.Collection();
cf.client = client;

const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}

const cooldowns = new Discord.Collection();

client.once('ready', () => {
	scheduling.turnOnSchedules();
	console.log('Ready!');
});

client.on('message', message => {
	if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;

	const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply('I can\'t execute that command inside DMs!');
	}

	if (command.permissions) {
		const authorPerms = message.channel.permissionsFor(message.author);
		if (!authorPerms || !authorPerms.has(command.permissions)) {
			return message.reply('You can not do this!');
		}
	}

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${process.env.PREFIX}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args);
	} catch (error) {
		console.error("Error executing the command: " + error);
		message.channel.send('There was an error trying to execute that command!');
	}
});

// #region Database create tables
const { Client } = require('pg');
const dbclient = new Client({
	connectionString: process.env.DATABASE_URL,
	ssl: {
	  rejectUnauthorized: false
	}
});

dbclient.connect()
.then(() => console.log("Connection to database successful."))
.then(() => dbclient.query("CREATE TABLE IF NOT EXISTS WeatherSchedule (id SERIAL, status text, type text, temperature text, lightning text, winds text, image text, color integer, forecastChannel text, weatherChannel text)"))
// .then(() => dbclient.query(`
// INSERT INTO WeatherSchedule
// VALUES (
// 	1,
// 	'on',
// 	'none',
// 	'x°C / X°F',
// 	'none',
// 	'Xmph ()',
// 	'https://cdn.glitch.com/aabc7c04-7768-48f9-b0a0-f1621bd9d381%2Fclear_skies.png?v=1581434913716',
// 	16044095,
// 	'606037277105455125',
// 	'817761381234901042'
// )
// `))
// .then(() => dbclient.query("SELECT * FROM WeatherSchedule"))
// .then(results => console.table(results.rows))
.catch(err => console.error("Error connecting to the database: " + err))
.finally(() => dbclient.end())

// #endregion

client.login(process.env.TOKEN);