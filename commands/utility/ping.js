const qh = require('../../components/queryHelper.js');

module.exports = {
	name: 'ping',
	description: 'Ping!',
	cooldown: 1,
	async execute(message) {
		let data = await qh.getWeatherSchedule();
		message.channel.send(data);
		// message.channel.send('Pong.');
	},
};