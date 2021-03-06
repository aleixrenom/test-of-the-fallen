module.exports = {
	name: 'ping',
	description: 'Ping!',
	cooldown: 1,
	execute(message) {
		message.channel.send('Pong.');
	},
};