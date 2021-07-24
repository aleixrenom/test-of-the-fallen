const qh = require('../../components/queryHelper.js');
const cf = require('../../components/commonFunctions.js');

module.exports = {
	name: 'ping',
	description: 'Ping!',
	cooldown: 1,
	async execute(message) {
		// let data = await qh.getWeatherSchedule();
		console.log(cf.client.channels.cache.get(message.channel.id));
		message.channel.send(cf.client.channels.cache.get(message.channel.id));
		message.channel.send('Pong.');
	},
};