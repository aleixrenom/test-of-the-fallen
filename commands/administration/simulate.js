const cf = require('../../components/commonFunctions.js');

module.exports = {
	name: 'simulate',
	description: '',
	cooldown: 1,
	async execute(message, args) {
		// message.channel.send(message.channel.parent.children.size).then().catch(err => console.error(err));
		message.channel.send('Received.').then().catch(e => console.error(e));
	},
};