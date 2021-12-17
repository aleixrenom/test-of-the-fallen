const qh = require('../../components/queryHelper.js');
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

		/**
		 * 
		 * @param {Int} players 
		 * @returns {Array} Array of rolls between 1 and 3 equal to players
		 */
		const generateAttacks = (players) => {
			let attacksArray = [];

			for (let i = 0; i < players; i++) {
				attacksArray.push(cf.rnd(1,3));
			}

			return attacksArray;
		}

		const simulateCombat = (ikuHp) => {
			let combatFinished = false;
			let enemyHp = ikuHp;

			// while (!combatFinished) {

			// }
		}

		message.channel.send(Array(7).fill(3).toString()).then().catch(e => console.error(e));
	},
};