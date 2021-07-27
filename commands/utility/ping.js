const qh = require('../../components/queryHelper.js');
const cf = require('../../components/commonFunctions.js');

module.exports = {
	name: 'ping',
	description: 'Ping!',
	cooldown: 1,
	async execute(message) {
		if (!message.member.roles.cache.has(cf.roleIdWeatherman)) {
			message.channel.send("You are not worthy of this command.");
			return;
		}

		message.channel.send('Pong.').then().catch(err => console.error(err));
	},
};