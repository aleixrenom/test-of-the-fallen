const qh = require('../../components/queryHelper.js');
const cf = require('../../components/commonFunctions.js');

module.exports = {
	name: 'ping',
	description: 'Ping!',
	cooldown: 1,
	async execute(message) {
		// const weathermanId = await qh.getId("role", "weatherman");
		if (!message.member._roles.includes(String(await qh.getId("role", "weatherman")))) {
			message.channel.send("You do not have the weatherman role.");
			return;
		}

		message.channel.send('Pong.').then().catch(err => console.error(err));
	},
};