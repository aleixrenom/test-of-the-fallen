const cf = require('../../components/commonFunctions.js');

module.exports = {
	name: 'simulate',
	description: '',
	cooldown: 1,
	async execute(message, args) {
		if (!message.member._roles.includes(String(await qh.getId("role", "admin")))) {
			message.channel.send("This command is only avaliable to Admins.").then().catch(e => console.error(e));
			return;
		}

		message.channel.send('Received.').then().catch(e => console.error(e));

		const generateAttacks = (players) => {
			let attacksArray = [];

			for (let i = 0; i < players; i++) {
				attacksArray.push(cf.rnd(1,3));
			}

			return attacksArray.toString();
		}

		message.channel.send(generateAttacks(7)).then().catch(e => console.error(e));
	},
};