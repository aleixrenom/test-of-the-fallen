const qh = require('../../components/queryHelper.js');
const cf = require('../../components/commonFunctions.js');

module.exports = {
	name: 'ping',
	description: 'Ping!',
	cooldown: 1,
	async execute(message) {
		// message.channel.send(message.channel.parent.children.size).then().catch(err => console.error(err));
		message.channel.send('Pong.').then().catch(e => console.error(e));

		function checkIfDayMonth() {
			try {
				const month = new Date().getMonth() + 1;
		
				if (month % 2 == 0) {
					// even, so night
					return false;
				} else {
					// odd, so day
					return true;
				}
			} catch(err) {
				console.log("There was an error in scheduling with checkIfDayMonth() - " + err)
			}
		}
		
		function changeServerIcon() {
			const data = cf.readDataFile('data');
			try {
			   if (checkIfDayMonth()) {
				cf.client.guilds.fetch(data.rotfId)
					.then(rotf => rotf.setIcon(data.images.day));
			   } else {
				cf.client.guilds.fetch(data.rotfId)
					.then(rotf => rotf.setIcon(data.images.night));
			   }
			} catch(err) {
			   console.log("There was an error in scheduling with changeServerIcon() - " + err)
		   }
		}

		changeServerIcon();
	},
};