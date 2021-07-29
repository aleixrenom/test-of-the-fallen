const qh = require('../../components/queryHelper.js');
const cf = require('../../components/commonFunctions.js');

module.exports = {
	name: 'ping',
	description: 'Ping!',
	cooldown: 1,
	async execute(message) {
		message.channel.send('```\n&nbsp;\n```').then().catch(err => console.error(err));
	},
};