const qh = require('../../components/queryHelper.js');
const cf = require('../../components/commonFunctions.js');
const { cp } = require('fs');

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

		const getDamagingAttack = (attack) => {
			switch (attack) {
				case 1:
					return 2;
					break;
				case 2:
					return 3;
					break;
				case 3:
					return 1;
					break;
				default:
					return 0;
					break;
			}
		}
		
		// returns true if players win
		const simulateCombat = (ikuHp) => {
			let combatFinished = false;
			let enemyHp = ikuHp;
			let playersHp = Array(7).fill(3);

			while (!combatFinished) {
				let playersAttacks = generateAttacks(playersHp.length);
				let ikuAttack = cf.rnd(1,3);

				playersAttacks.forEach(playerAttack => {
					if (playerAttack === getDamagingAttack(ikuAttack)) enemyHp -= 1;
				})

				if (enemyHp <= 0) return true;

				playersAttacks.forEach((playerAttack, index) => {
					if (ikuAttack === getDamagingAttack(playerAttack)) playersHp[index] -= 1;
				})

				playersHp = playersHp.filter(e => e > 0);

				if (playersHp.length <= 0) combatFinished = true;
			}

			return false;
		}

		message.channel.send(simulateCombat(15) ? "Players win" : "Iku wins").then().catch(e => console.error(e));
	},
};