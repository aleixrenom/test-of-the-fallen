// Invitation link: https://discord.com/oauth2/authorize?client_id=812291101934616587&scope=bot
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const cf = require('./components/commonFunctions.js');
// const qh = require('./components/queryHelper.js');
const scheduling = require('./components/scheduling.js');

const myIntents = new Intents([
	Intents.FLAGS.GUILDS,
	Intents.FLAGS.GUILD_MEMBERS,
	Intents.FLAGS.GUILD_INTEGRATIONS,
	Intents.FLAGS.GUILD_MESSAGES,
	Intents.FLAGS.DIRECT_MESSAGES,
	Intents.FLAGS.DIRECT_MESSAGE_REACTIONS
])
const client = new Client({ intents: myIntents });
client.commands = new Collection();
cf.client = client;

const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}

const cooldowns = new Collection();

client.once('ready', () => {
	scheduling.turnOnSchedules();
	console.log('Ready!');
});

client.on('messageCreate', message => {
	if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;

	const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply({ content: 'I can\'t execute that command inside DMs!', allowedMentions: { repliedUser: false }}).then().catch(e => console.error(e));
	}

	if (command.permissions) {
		const authorPerms = message.channel.permissionsFor(message.author);
		if (!authorPerms || !authorPerms.has(command.permissions)) {
			return message.reply({ content: 'You can not do this!', allowedMentions: { repliedUser: false }}).then().catch(e => console.error(e));
		}
	}

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${process.env.PREFIX}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply).then().catch(e => console.error(e));
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.channel.send(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`).then().catch(e => console.error(e));
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args);
	} catch (error) {
		console.error("Error executing the command: " + error);
		message.channel.send('There was an error trying to execute that command!').then().catch(e => console.error(e));
	}
});

client.on('threadCreate', thread => {
	if (thread.joinable)
		thread.join()
			.then(threadChannel => console.log("Joined thread " + threadChannel.name))
			.catch(e => console.error("Error trying to join a thread: " + e));
})

client.login(process.env.TOKEN);