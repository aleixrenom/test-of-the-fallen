const qh = require('../../components/queryHelper.js');
const cf = require('../../components/commonFunctions.js');

module.exports = {
	name: 'ping',
	description: 'Ping!',
	cooldown: 1,
	async execute(message) {
		const weathermanId = await qh.getId("role", "admin");
		message.channel.send("```json\n" + JSON.stringify(message.member.roles, null, 2) + "\n```");
		console.log(message.member.roles);
		if (!message.member.roles.cache.has(weathermanId)) {
			// message.channel.send("You do not have the admin role.");
			return;
		}

		message.channel.send('Pong.').then().catch(err => console.error(err));
	},
};