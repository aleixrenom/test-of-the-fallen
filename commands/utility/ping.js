const qh = require('../../components/queryHelper.js');
const cf = require('../../components/commonFunctions.js');

module.exports = {
	name: 'ping',
	description: 'Ping!',
	cooldown: 1,
	async execute(message) {
		const weathermanId = await qh.getId("role", "admin");
		message.channel.send("```json\n" + JSON.parse(message.member._roles).includes(weathermanId) + "\n```");
		console.log(JSON.parse(message.member._roles));
		console.log("Includes: " + JSON.parse(message.member._roles).includes(weathermanId));
		if (!message.member.roles.cache.has(weathermanId)) {
			// message.channel.send("You do not have the admin role.");
			return;
		}

		message.channel.send('Pong.').then().catch(err => console.error(err));
	},
};