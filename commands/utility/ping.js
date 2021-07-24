const qh = require('../../components/queryHelper.js');

module.exports = {
	name: 'ping',
	description: 'Ping!',
	cooldown: 1,
	async execute(message) {
		message.channel.send('Pong.');
		// qh.getWeatherSchedule()
		// .then(results => console.log(results))
		// .catch(err => console.error(err))
	},
};